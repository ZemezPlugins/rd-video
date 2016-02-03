###*
 * @module       RDVideo
 * @author       Rafael Shayvolodyan
 * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
 * @version      1.0.0
###

(($, document, window) ->
  ###*
   * Initial flags
   * @public
  ###
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0
  NOT_IMPLEMENTED_MSG = 'Not implemented'

  ###*
   * Creates a RDVideo
   * @class RDVideo
   * @public
   * @param {HTMLElement} element - The element to create the RDVideo for.
   * @param {Object} [options] - The options
  ###
  class RDVideo


    ###*
     * Default options for RDVideo
     * @public
    ###
    Defaults:
      position: '50% 50%'
      volume: 0.5
      playbackRate: 1
      muted: true
      loop: true
      autoplay: true
      fps: 30
      transitionTime: 300
      posterType: 'jpg'
      path: 'video/video'
      background: true
      controls: false
      hideWhenSlow: false
      imgSize:
        xs: ''
        sm: ''
        md: ''
        lg: ''
        xlg: ''
      onLoad: false

    constructor: (element, options) ->
      @options = $.extend(true, {}, @Defaults, options)
      @$element = $(element)
      @$win = $(window)
      @$doc = $(document)
      @interval = null
      @classNames =
        playBtn: '[data-rd-video-btn="play"]'
        muteBtn: '[data-rd-video-btn="mute"]'
        playing: 'playing'
        paused: 'paused'
        muted: 'muted'
      @$playBtn = @.$element.find(@.classNames.playBtn)
      @$muteBtn = @.$element.find(@.classNames.muteBtn)

      @initialize()

    ###*
     * Initializes the RD Video.
     * @protected
    ###
    initialize: () ->
      ctx = @
      ctx.path = if @.$element.attr('data-rd-video-path') then ctx.$element.attr('data-rd-video-path') else ctx.options.path
      ctx.imgSize =
        xs: if @.$element.attr('data-rd-video-image-xs') then ctx.$element.attr('data-rd-video-image-xs') else ctx.options.imgSize.xs
        sm: if @.$element.attr('data-rd-video-image-sm') then ctx.$element.attr('data-rd-video-image-sm') else ctx.options.imgSize.sm
        md: if @.$element.attr('data-rd-video-image-md') then ctx.$element.attr('data-rd-video-image-md') else ctx.options.imgSize.md
        lg: if @.$element.attr('data-rd-video-image-lg') then ctx.$element.attr('data-rd-video-image-lg') else ctx.options.imgSize.lg
        xlg: if @.$element.attr('data-rd-video-image-xlg') then ctx.$element.attr('data-rd-video-image-xlg') else ctx.options.imgSize.xlg
      ctx.suffix = ctx.getSuffix()
      ctx.getConnectionSpeed(ctx.path, ->
        ctx.init(ctx)
      )

      return

    ###*
    * Initializes the RD Video after checking internet connection speed
    * @protected
    ###
    init: (ctx) ->
      ctx.position = ctx.parsePosition(if @.$element.attr('data-rd-video-position') then ctx.$element.attr('data-rd-video-position') else ctx.options.position)
      ctx.isBG = if @.$element.attr('data-rd-video-background') then ctx.$element.attr('data-rd-video-background') is 'true' else ctx.options.background
      ctx.hideWhenSlow = if @.$element.attr('data-rd-video-hide') then ctx.$element.attr('data-rd-video-hide') is 'true' else ctx.options.hideWhenSlow
      ctx.posterType = if @.$element.attr('data-rd-video-poster') then ctx.$element.attr('data-rd-video-poster') else ctx.options.posterType

      ctx.createDOM(ctx)
      if not (isMobile and ctx.isBG)
        ctx.createVideo(ctx)
        ctx.applyPlayButton()
        ctx.applyMuteButton()
        if not ctx.isBG
          ctx.contextMenuBuilder()
      ctx.options.onLoad.call(@, ctx) if ctx.options.onLoad
      ctx.$win.on('resize', $.proxy(ctx.resize, @, ctx))
      ctx.$element.on('resize', $.proxy(ctx.resize, @, ctx))
      ctx.$win.on('scroll', $.proxy(ctx.onScroll, @, ctx))

      return


    ###*
    * Parse a position option
    * @protected
    * @param {String} str
    ###
    parsePosition: (str) ->
      args = str.split(/\s+/)
      x = '50%';
      y = '50%';
      for arg, i in args
        if arg is 'left'
          x = '0%'
        else if arg is 'right'
          x = '100%'
        else if arg is 'top'
          y = '0%'
        else if arg is 'bottom'
          y = '100%'
        else if arg is 'center'
          if i is 0
            x = '50%'
          else
            y = '50%'
        else
          if i is 0
            x = arg
          else
            y = arg
      return {x: x, y: y}

    ###*
    * Calculates internet connection speed and run callback function
    * @protected
    * @param {String} path - path to image poster
    * @param {Function} callback
    ###
    getConnectionSpeed: (path, callback) ->
      ctx = @
      path += '-' + ctx.suffix + '.' + ctx.options.posterType
      img = new Image()
      img.onload = ->
        end = Date.now()
        ctx.speed = Math.round(ctx.imgSize[ctx.suffix] / ((end - start) / 1000))
        callback()

      start = Date.now()
      path += '?t=' + start
      setTimeout(->
        img.src = path
        start = Date.now()
      , 300)

      return

    getVideoSuffix: (speed) ->
      if speed < 50
        return 'xs'
      else if speed < 100
        return 'sm'
      else if speed < 200
        return 'md'
      else if speed < 800
        return 'lg'
      else
        return 'xlg'

    ###*
    * Creates neseccary HTML Markup
    * @protected
    ###
    createDOM: (ctx) ->
      if ctx.isBG
        ctx.$element.addClass('rd-video-bg')
      $preloader = ctx.$preloader = $('<div class="rd-video-preloader">')
      if not ctx.isBG
        $context = ctx.$context = $('<div class="rd-video-context-wrapper"> <div class="rd-video-context">')

      $wrapper = ctx.$wrapper = $('<div class="rd-video-wrapper">').css({
        'background-position': ctx.position.x + ' ' + ctx.position.y
        'background-image': 'url(' + ctx.path + '-' + ctx.suffix + '.' + ctx.options.posterType + ')'
      });

      ctx.$element.prepend($wrapper)
      ctx.$wrapper.prepend($context)
      ctx.$wrapper.prepend($preloader)
      return

    ###*
    * Creates video tag
    * @protected
    ###
    createVideo: (ctx) ->
      options = ctx.options
      sources = ''
      autoplay = false
      allsuffixes = ['xs', 'sm', 'md', 'lg', 'xlg']
      suffixes = ctx.getSuffixArray()

      if ctx.$video?
        for sufix, i in suffixes
          if sufix is ctx.suffix
            if i isnt 0
              suffix = suffixes[i-1]
            else if ctx.hideWhenSlow
              ctx.removeVideo(ctx)
              return
            break
      else
          suffix = ctx.getVideoSuffix(ctx.speed)

      while suffixes.indexOf(suffix) is -1
        index = allsuffixes.indexOf(suffix)
        if index isnt 0
          suffix = allsuffixes[index - 1]
        else return

      ctx.suffix = suffix
      path = ctx.path + '-' + suffix

      if typeof path is 'undefined'
        return

      if typeof path is 'object'
        if path.mp4
          sources += '<source src="' + path.mp4 + '.mp4" type="video/mp4">'

        if path.webm
          sources += '<source src="' + path.webm + '.webm" type="video/webm">'

        if path.ogv
          sources += '<source src="' + path.ogv + '.ogv" type="video/ogg">'

          $video = $('<video>' + sources + '</video>')
      else
        $video = $('<video>' +
        '<source src="' + path + '.mp4" type="video/mp4">' +
        '<source src="' + path + '.webm" type="video/webm">' +
        '<source src="' + path + '.ogv" type="video/ogg">' +
        '</video>')

      if ctx.$video?
        ctx.$video2 = $video
      else
        ctx.$video = $video

      if ctx.$video2?
        autoplay = not ctx.$video[0].paused
      else if ctx.isBG
        autoplay = if @.$element.attr('data-rd-video-autoplay') then ctx.$element.attr('data-rd-video-autoplay') else options.autoplay
      volume = if @.$element.attr('data-rd-video-volume') then ctx.$element.attr('data-rd-video-volume') else options.volume
      muted = if @.$element.attr('data-rd-video-muted') then ctx.$element.attr('data-rd-video-muted') is 'true' else options.muted
      playbackRate = if @.$element.attr('data-rd-video-pbrate') then ctx.$element.attr('data-rd-video-pbrate') else options.playbackRate
      controls = if @.$element.attr('data-rd-video-controls') then ctx.$element.attr('data-rd-video-controls') is 'true' else options.controls

      try
        $video
        # Set video properties
        .prop({
          autoplay: autoplay
          volume: if ctx.$video2? then ctx.$video[0].volume else volume
          muted: if ctx.$video2? then ctx.$video.prop('muted') else muted
          defaultMuted: if ctx.$video2? then ctx.$video.prop('muted') else muted
          playbackRate: if ctx.$video2? then ctx.$video.prop('playbackRate') else playbackRate
          defaultPlaybackRate: if ctx.$video2? then ctx.$video.prop('playbackRate') else playbackRate
          controls: if ctx.$video2? then ctx.$video.prop('controls') else controls
        })
      catch e
        throw new Error(NOT_IMPLEMENTED_MSG)

      ctx.started = false
      ctx.applyListeners(ctx, $video)
      ctx.$wrapper.append($video)
      return

    ###*
    * Apply event Listeners to video
    * @protected
    * @param {jQuery Object} $video
    ###
    applyListeners: (ctx, $video) ->
      video = $video[0]
      ctx.tmp = if ctx.$video2? then false else true
      start = 0
      fps =  ctx.options.fps - ctx.options.fps / 4

      # Resize a video, when it's loaded
      $video.one('canplaythrough.rd.video', ->
        ctx.resize()
        ctx.$win.trigger('scroll')
        if not isMobile
          ctx.$element.removeClass('loading')

        if ctx.$video2?
          ctx.$video2[0].currentTime = ctx.$video[0].currentTime
          if not ctx.isBG
            ctx.replaceVideo(ctx)
            ctx.started = true
            ctx.play()
        return
      )

      .one('playing.rd.video', ->
        if ctx.$video2?
          ctx.$video2[0].currentTime = ctx.$video[0].currentTime
        else if not isMobile
          $video.css({
            visibility: 'visible',
            opacity: 1
          })

        if not ctx.isBG and not isMobile
          ctx.$element.removeClass('loading')
        ctx.getFPS(ctx, video)
        return
      )

      .on('waiting.rd.video', ->
        if isMobile
          ctx.$element.addClass('loading')
      )

      .on('ended.rd.video', ->
        start = 0
        loops = if ctx.$element.attr('data-rd-video-loop') then ctx.$element.attr('data-rd-video-loop') is 'true' else ctx.options.loop

        if loops
          video.play()
          $video.prop({loop: loops})
        clearInterval(ctx.interval)
        return
      )

      .on('play.rd.video', ->
        ctx.$element.removeClass(ctx.classNames.paused).addClass(ctx.classNames.playing)
        if isMobile and ctx.timeout?
          clearTimeout(ctx.timeout)
        return
      )

      .on('pause.rd.video', ->
        ctx.$element.removeClass(ctx.classNames.playing).addClass(ctx.classNames.paused)
        if isMobile and ctx.timeout?
          clearTimeout(ctx.timeout)
        return
      )

      .on('volumechange.rd.video', ->
        if ctx.$video[0].muted then ctx.$element.addClass(ctx.classNames.muted) else ctx.$element.removeClass(ctx.classNames.muted)
        return
      )

      .on('loadeddata.rd.video', ->
        if not isMobile
          ctx.$element.removeClass('loading')
        if ctx.time?
          video.currentTime = ctx.time
          ctx.play()
      )

      $video.on('timeupdate.rd.video', ->
        if isMobile
          ctx.$element.removeClass('loading')
        if ctx.time?
          return
        if isMac and not ctx.started
          ctx.resize()
        ctx.started = true
        if ctx.$element.hasClass('loading')
          ctx.$element.removeClass('loading')
        if isMobile
          $video.currentTime = 0
          $video.css({
            visibility: 'visible',
            opacity: 1
          })
          ctx.resize()
        else
          if ctx.$video2? and not ctx.tmp and ctx.isBG
            ctx.$video2[0].currentTime = ctx.$video[0].currentTime
            ctx.replaceVideo(ctx)
            ctx.tmp = true
            start = 0
            return
          # Getting current Time
          curr = video.currentTime

          # Getting start time when video loaded
          if start is 0
            start = curr
            if ctx.$video2 is null
              start += 3

          if curr > start + 1.5 and ctx.tmp
            if ctx.fps? and ctx.fps < fps and ctx.fps isnt 0
              ctx.createVideo(ctx)
              ctx.tmp = false
              $video.off('timeupdate.rd.video')
          return
      )
      return

    ###*
    * Add Listener for play/pause button
    * @protected
    ###
    applyPlayButton: () ->
      ctx = @
      ctx.$playBtn.on('click touchstart', (e) ->
        if not ctx.started
          ctx.$element.addClass('loading')

        e.preventDefault()
        isPaused = ctx.$video[0].paused
        if isPaused
          ctx.play()
        else
          ctx.pause()
      )
      return

    ###*
    * Add Listener for mute/unmute button
    * @protected
    ###
    applyMuteButton: () ->
      ctx = @

      ctx.$muteBtn.on('click touchstart', (e) ->
        e.preventDefault()
        isMuted = ctx.$video.prop('muted')
        if isMuted
          ctx.unmute()
        else
          ctx.mute()
      )
      return

    ###*
    * Changes video quality
    * @protected
    * @param {String} quality - video suffix
    ###
    changeQuality: (ctx, quality) ->
      if !ctx.$element.hasClass('loading')
        ctx.$element.addClass('loading')
        ctx.$video[0].pause()
        ctx.time = ctx.$video[0].currentTime
        if ctx.$video.find('source[type*="mp4"]').length
          ctx.$video.find('source[type*="mp4"]')[0].setAttribute('src', ctx.path + '-' + quality + '.mp4')
        if ctx.$video.find('source[type*="webm"]').length
          ctx.$video.find('source[type*="webm"]')[0].setAttribute('src', ctx.path + '-' + quality + '.webm')
        if ctx.$video.find('source[type*="ogg"]').length
          ctx.$video.find('source[type*="ogg"]')[0].setAttribute('src', ctx.path + '-' + quality + '.ogg')
        ctx.$video[0].load()
      return

    ###*
    * Creates context menu and apply listeners
    * @protected
    ###
    contextMenuBuilder: () ->
      ctx = @
      suffixes = ctx.getSuffixArray()
      $contextmenu = ctx.$context

      content = '<h6>Quality:</h6>'
      content += '<ul>'
      for suffix in suffixes
        qualText = ctx.getQualityText(suffix)
        if suffix is ctx.suffix
          content += '<li class="active" data-rd-quality="' + suffix + '">' + qualText + '</li>'
        else
          content += '<li data-rd-quality="' + suffix + '">' + qualText + '</li>'
      content += '</ul>'

      $contextmenu.find('.rd-video-context').append(content)

      $contextmenu.find('[data-rd-quality]').on('click', (e)->
        $this = $(this)
        $contextmenu.removeClass('show')
        if isMobile
          $contextmenu.appendTo(ctx.$wrapper)
        if not $this.hasClass('active')
          $contextmenu.find('.active').removeClass('active')
          $(this).addClass('active')
          ctx.changeQuality(ctx, @.getAttribute('data-rd-quality'))
          return
      )

      if not isMobile
        ctx.$doc.on('contextmenu', (e) ->
          if not $(e.target).is(ctx.$video)
            $contextmenu.removeClass('show')
        )
        ctx.$doc.on('click', (e) ->
          $contextmenu.removeClass('show')
        )
        ctx.$video.on('contextmenu', $.proxy(ctx.onContext, @, ctx))

      else
        ctx.timeout = null

        ctx.$doc.on('touchstart', (e) ->
          if $(e.target).parents('.rd-video-context').length is 0
            $contextmenu.removeClass('show')
            $contextmenu.appendTo(ctx.$wrapper)
          return
        )

        ctx.$video.on('touchstart', (e)->
          fullscreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement
          if not fullscreen
            ctx.timeout = setTimeout(->
              $contextmenu.appendTo('body')
              setTimeout(->
                $contextmenu.addClass('show')
              , 10)
            , 300)
          return
        )

        ctx.$doc.on('touchend', (e) ->
          clearTimeout(ctx.timeout)
          return
        )


      return

    ###*
    * Sets position relative to mouse click
    * @protected
    ###
    onContext: (ctx, e) ->
      e.preventDefault()
      $contextmenu = ctx.$context
      offt = ctx.$element.offset().top
      offl = ctx.$element.offset().left
      w = ctx.$element.outerWidth()
      h = ctx.$element.outerHeight()
      cw = $contextmenu.find('.rd-video-context').outerWidth()
      ch = $contextmenu.find('.rd-video-context').outerHeight()
      wh = ctx.$win.height()
      x = e.pageX
      y = e.pageY
      cy = e.clientY
      top = y - offt
      left = x - offl

      if (top + ch > h and cy - ch > 0) or (cy + ch > wh  and top - ch > 0)
        $contextmenu.css({
          'top': 'auto'
          'bottom' : h - top
        })
      else if cy + ch < wh and top + ch < h
        $contextmenu.css({
          'top': top
          'bottom' : 'auto'
        })
      else
        $contextmenu.removeClass('show')
        return
      if left + cw > w
        $contextmenu.css({
          'left': 'auto'
          'right' : w - left
        })
      else
        $contextmenu.css({
          'left': left
          'right' : 'auto'
        })
      $contextmenu.addClass('show')
      return

    ###*
    * Returns text quality from video suffix
    * @protected
    * @param {String str}
    ###
    getQualityText: (str) ->
      switch str
        when 'xs' then '240p'
        when 'sm' then '360p'
        when 'md' then '480p'
        when 'lg' then '720p'
        when 'xlg' then '1080p'
        else ''

    ###*
    * Stops video playing when it's not in viewport
    * @protected
    ###
    onScroll: (ctx) ->
      scrt = ctx.$win.scrollTop()
      offt = ctx.$element.offset().top
      h = ctx.$element.outerHeight()
      wh = ctx.$win.height()
      if not ctx.isBG
        ctx.$context.removeClass('show')

      if offt < scrt + wh and offt + h > scrt
        if ctx.$element.hasClass('viewport-stopped') and ctx.$element.hasClass(@.classNames.paused)
          ctx.play()
          ctx.$element.removeClass('viewport-stopped')
      else
        if ctx.$element.hasClass(@.classNames.playing)
          ctx.pause()
          ctx.$element.addClass('viewport-stopped')
      return

    ###*
    * Play video
    * @protected
    ###
    play: () ->
      @.$video[0].play()
      if @.$video2?
        @.$video2[0].play()

      return

    ###*
    * Pause video
    * @protected
    ###
    pause: () ->
      @.$video[0].pause()
      if @.$video2?
        @.$video2[0].pause()
      return

    ###*
    * Mute video
    * @protected
    ###
    mute: () ->
      @.$video.prop('muted', true)
      if @.$video2?
        @.$video2.prop('muted', true)
      return

    ###*
    * Unmute video
    * @protected
    ###
    unmute: () ->
      @.$video.prop('muted', false)
      if @.$video2?
        @.$video2.prop('muted', false)
      return

    ###*
    * Remove video from DOM
    * @protected
    ###
    removeVideo: (ctx) ->
      clearInterval(ctx.interval)
      ctx.$video.remove()
      ctx.$video = null
      return

    ###*
    * Replace video
    * @protected
    ###
    replaceVideo: (ctx) ->
      if ctx.$video2?
        clearInterval(ctx.interval)
        ctx.$video2.addClass('transition')
        ctx.$video2.css({
          visibility: 'visible',
          opacity: 1
        })
        setTimeout(->
          ctx.fps = null
          ctx.$video.remove()
          ctx.$video = ctx.$video2
          ctx.getFPS(ctx, ctx.$video[0])
          ctx.$video.on('contextmenu', $.proxy(ctx.onContext, @, ctx))
          ctx.$video2 = null
          ctx.tmp = true
        , ctx.options.transitionTime)
      return

    ###*
    * Checks if video plays with lagging
    * @protected
    * @param {HTML Element} video
    ###
    getFPS: (ctx, video) ->
      prevTime = 0
      frames = 0
      time = 0
      startTime = video.currentTime

      ctx.fps = 0
      ctx.interval = setInterval( ->
        if not video.paused
          videoTime = video.currentTime

          if videoTime is startTime
            startTime = -1
            return null

          if time > 5000
            frames = 0
            time = 0
          if videoTime isnt prevTime
            prevTime = videoTime
            frames++
          time += 1000 / ctx.options.fps
          ctx.fps =  Math.round(frames / time * 1000)
      , 1000 / ctx.options.fps)
      return null

    ###*
    * Resize function
    * @protected
    ###
    resize: () ->
      @resizeVideo(@.$video)
      if @.$video2?
        @resizeVideo(@.$video2)
      return

    ###*
    * Resize video
    * @protected
    * @param {jQuery Object} $video
    ###
    resizeVideo: ($video) ->
      $wrapper = @.$wrapper
      # Get a wrapper size
      wrapperHeight = $wrapper.outerHeight()
      wrapperWidth = $wrapper.outerWidth()


      video = $video[0]

      # Get a native video size
      videoHeight = video.videoHeight
      videoWidth = video.videoWidth
      if videoHeight is 0 or videoWidth is 0
        return

      if wrapperWidth / videoWidth > wrapperHeight / videoHeight
        $video.css({
        # +2 pixels to prevent an empty space after transformation
          width: wrapperWidth
          left: 0
          height: 'auto'
        })
        $video.css({
          top:  (wrapperHeight - video.offsetHeight ) * (parseInt(@.position.y.replace('%', '')) / 100)
        })
      else
        $video.css({
          width: 'auto'
        # +2 pixels to prevent an empty space after transformation
          height: wrapperHeight
          top: 0
        })
        $video.css({
          left:  (wrapperWidth - video.offsetWidth ) * (parseInt(@.position.x.replace('%', '')) / 100)
        })
      return

    ###*
    * Checks imgSize option for current suffix
    * @protected
    ###
    getSuffixArray: () ->
      arr = []
      for suffix, value of @.imgSize
        if value.length
          arr.push(suffix)
        else
          delete @.imgSize[suffix]
      return arr

    ###*
    * Gets suffix based on window width
    * @protected
    ###
    getSuffix: ->
      if @.path?
        width = @.$win.width()
        if width > 1600 and @.imgSize['xlg'].length
          return 'xlg'
        else if width > 1199 and @.imgSize['lg'].length
          return 'lg'
        else if width > 991 and @.imgSize['md'].length
          return 'md'
        else if width > 767 and @.imgSize['sm'].length
          return 'sm'
        else return 'xs'

    ###*
    * Gets specific option of plugin
    * @protected
    ###
    getOption: (key)->
      if @.options.responsive?
        for point of @.options.responsive
          if point <= @.$win.width() then targetPoint = point
        if @.options.responsive[targetPoint][key]? then @.options.responsive[targetPoint][key] else @.options[key]
      else
        @.options[key]

  ###*
   * The jQuery Plugin for the RDVideo
   * @public
  ###
  $.fn.extend RDVideo: (options) ->
    @each ->
      $this = $(this)
      if !$this.data('RDVideo')
        $this.data 'RDVideo', new RDVideo(this, options)

  window.RDVideo = RDVideo

) window.jQuery, document, window


###*
 * The Plugin AMD export
 * @public
###
if module?
  module.exports = window.RDVideo

else if typeof define is 'function' && define.amd
  define(["jquery"], () ->
    'use strict'
    return window.RDVideo

  )