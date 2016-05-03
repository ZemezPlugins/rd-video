/**
 * @module       RDVideo
 * @author       Rafael Shayvolodyan
 * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
 * @version      1.0.2
 */

(function() {
  (function($, document, window) {

    /**
     * Initial flags
     * @public
     */
    var NOT_IMPLEMENTED_MSG, RDVideo, isMac, isMobile;
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    NOT_IMPLEMENTED_MSG = 'Not implemented';

    /**
     * Creates a RDVideo
     * @class RDVideo
     * @public
     * @param {HTMLElement} element - The element to create the RDVideo for.
     * @param {Object} [options] - The options
     */
    RDVideo = (function() {

      /**
       * Default options for RDVideo
       * @public
       */
      RDVideo.prototype.Defaults = {
        position: '50% 50%',
        volume: 0.5,
        playbackRate: 1,
        muted: true,
        loop: true,
        autoplay: true,
        preload: 'auto',
        fps: 30,
        transitionTime: 300,
        posterType: 'jpg',
        path: 'video/video',
        background: true,
        controls: false,
        hideWhenSlow: false,
        imgSize: {
          xs: '',
          sm: '',
          md: '',
          lg: '',
          xlg: ''
        },
        onLoad: false
      };

      function RDVideo(element, options) {
        this.options = $.extend(true, {}, this.Defaults, options);
        this.$element = $(element);
        this.$win = $(window);
        this.$doc = $(document);
        this.interval = null;
        this.classNames = {
          playBtn: '[data-rd-video-btn="play"]',
          muteBtn: '[data-rd-video-btn="mute"]',
          playing: 'playing',
          paused: 'paused',
          muted: 'muted'
        };
        this.$playBtn = this.$element.find(this.classNames.playBtn);
        this.$muteBtn = this.$element.find(this.classNames.muteBtn);
        this.initialize();
      }


      /**
       * Initializes the RD Video.
       * @protected
       */

      RDVideo.prototype.initialize = function() {
        var ctx;
        ctx = this;
        ctx.path = this.$element.attr('data-rd-video-path') ? ctx.$element.attr('data-rd-video-path') : ctx.options.path;
        ctx.imgSize = {
          xs: this.$element.attr('data-rd-video-image-xs') ? ctx.$element.attr('data-rd-video-image-xs') : ctx.options.imgSize.xs,
          sm: this.$element.attr('data-rd-video-image-sm') ? ctx.$element.attr('data-rd-video-image-sm') : ctx.options.imgSize.sm,
          md: this.$element.attr('data-rd-video-image-md') ? ctx.$element.attr('data-rd-video-image-md') : ctx.options.imgSize.md,
          lg: this.$element.attr('data-rd-video-image-lg') ? ctx.$element.attr('data-rd-video-image-lg') : ctx.options.imgSize.lg,
          xlg: this.$element.attr('data-rd-video-image-xlg') ? ctx.$element.attr('data-rd-video-image-xlg') : ctx.options.imgSize.xlg
        };
        ctx.suffix = ctx.getSuffix();
        ctx.getConnectionSpeed(ctx.path, function() {
          return ctx.init(ctx);
        });
      };


      /**
      * Initializes the RD Video after checking internet connection speed
      * @protected
       */

      RDVideo.prototype.init = function(ctx) {
        ctx.position = ctx.parsePosition(this.$element.attr('data-rd-video-position') ? ctx.$element.attr('data-rd-video-position') : ctx.options.position);
        ctx.isBG = this.$element.attr('data-rd-video-background') ? ctx.$element.attr('data-rd-video-background') === 'true' : ctx.options.background;
        ctx.hideWhenSlow = this.$element.attr('data-rd-video-hide') ? ctx.$element.attr('data-rd-video-hide') === 'true' : ctx.options.hideWhenSlow;
        ctx.posterType = this.$element.attr('data-rd-video-poster') ? ctx.$element.attr('data-rd-video-poster') : ctx.options.posterType;
        ctx.createDOM(ctx);
        if (!(isMobile && ctx.isBG)) {
          ctx.createVideo(ctx);
          ctx.applyPlayButton();
          ctx.applyMuteButton();
          if (!ctx.isBG) {
            ctx.contextMenuBuilder();
          }
        }
        if (ctx.options.onLoad) {
          ctx.options.onLoad.call(this, ctx);
        }
        ctx.$win.on('resize', $.proxy(ctx.resize, this, ctx));
        ctx.$element.on('resize', $.proxy(ctx.resize, this, ctx));
        ctx.$win.on('scroll', $.proxy(ctx.onScroll, this, ctx));
      };


      /**
      * Parse a position option
      * @protected
      * @param {String} str
       */

      RDVideo.prototype.parsePosition = function(str) {
        var arg, args, i, j, len, x, y;
        args = str.split(/\s+/);
        x = '50%';
        y = '50%';
        for (i = j = 0, len = args.length; j < len; i = ++j) {
          arg = args[i];
          if (arg === 'left') {
            x = '0%';
          } else if (arg === 'right') {
            x = '100%';
          } else if (arg === 'top') {
            y = '0%';
          } else if (arg === 'bottom') {
            y = '100%';
          } else if (arg === 'center') {
            if (i === 0) {
              x = '50%';
            } else {
              y = '50%';
            }
          } else {
            if (i === 0) {
              x = arg;
            } else {
              y = arg;
            }
          }
        }
        return {
          x: x,
          y: y
        };
      };


      /**
      * Calculates internet connection speed and run callback function
      * @protected
      * @param {String} path - path to image poster
      * @param {Function} callback
       */

      RDVideo.prototype.getConnectionSpeed = function(path, callback) {
        var ctx, img, start;
        ctx = this;
        path += '-' + ctx.suffix + '.' + ctx.options.posterType;
        img = new Image();
        img.onload = function() {
          var end;
          end = Date.now();
          ctx.speed = Math.round(ctx.imgSize[ctx.suffix] / ((end - start) / 1000));
          return callback();
        };
        start = Date.now();
        path += '?t=' + start;
        setTimeout(function() {
          img.src = path;
          return start = Date.now();
        }, 300);
      };

      RDVideo.prototype.getVideoSuffix = function(speed) {
        if (speed < 50) {
          return 'xs';
        } else if (speed < 100) {
          return 'sm';
        } else if (speed < 200) {
          return 'md';
        } else if (speed < 800) {
          return 'lg';
        } else {
          return 'xlg';
        }
      };


      /**
      * Creates neseccary HTML Markup
      * @protected
       */

      RDVideo.prototype.createDOM = function(ctx) {
        var $context, $preloader, $wrapper;
        if (ctx.isBG) {
          ctx.$element.addClass('rd-video-bg');
        }
        $preloader = ctx.$preloader = $('<div class="rd-video-preloader">');
        if (!ctx.isBG) {
          $context = ctx.$context = $('<div class="rd-video-context-wrapper"> <div class="rd-video-context">');
        }
        $wrapper = ctx.$wrapper = $('<div class="rd-video-wrapper">').css({
          'background-position': ctx.position.x + ' ' + ctx.position.y,
          'background-image': 'url(' + ctx.path + '-' + ctx.suffix + '.' + ctx.options.posterType + ')'
        });
        ctx.$element.prepend($wrapper);
        ctx.$wrapper.prepend($context);
        ctx.$wrapper.prepend($preloader);
      };


      /**
      * Creates video tag
      * @protected
       */

      RDVideo.prototype.createVideo = function(ctx) {
        var $video, allsuffixes, autoplay, controls, e, error, i, index, j, len, muted, options, path, playbackRate, preload, sources, suffix, suffixes, sufix, volume;
        options = ctx.options;
        sources = '';
        autoplay = false;
        allsuffixes = ['xs', 'sm', 'md', 'lg', 'xlg'];
        suffixes = ctx.getSuffixArray();
        if (ctx.$video != null) {
          for (i = j = 0, len = suffixes.length; j < len; i = ++j) {
            sufix = suffixes[i];
            if (sufix === ctx.suffix) {
              if (i !== 0) {
                suffix = suffixes[i - 1];
              } else if (ctx.hideWhenSlow) {
                ctx.removeVideo(ctx);
                return;
              }
              break;
            }
          }
        } else {
          suffix = ctx.getVideoSuffix(ctx.speed);
        }
        while (suffixes.indexOf(suffix) === -1) {
          index = allsuffixes.indexOf(suffix);
          if (index !== 0) {
            suffix = allsuffixes[index - 1];
          } else {
            return;
          }
        }
        ctx.suffix = suffix;
        path = ctx.path + '-' + suffix;
        if (typeof path === 'undefined') {
          return;
        }
        if (typeof path === 'object') {
          if (path.mp4) {
            sources += '<source src="' + path.mp4 + '.mp4" type="video/mp4">';
          }
          if (path.webm) {
            sources += '<source src="' + path.webm + '.webm" type="video/webm">';
          }
          if (path.ogv) {
            sources += '<source src="' + path.ogv + '.ogv" type="video/ogg">';
            $video = $('<video>' + sources + '</video>');
          }
        } else {
          $video = $('<video>' + '<source src="' + path + '.mp4" type="video/mp4">' + '<source src="' + path + '.webm" type="video/webm">' + '<source src="' + path + '.ogv" type="video/ogg">' + '</video>');
        }
        if (ctx.$video != null) {
          ctx.$video2 = $video;
        } else {
          ctx.$video = $video;
        }
        if (ctx.$video2 != null) {
          autoplay = !ctx.$video[0].paused;
        } else if (ctx.isBG) {
          autoplay = this.$element.attr('data-rd-video-autoplay') ? ctx.$element.attr('data-rd-video-autoplay') === "true" : options.autoplay;
        }
        volume = this.$element.attr('data-rd-video-volume') ? ctx.$element.attr('data-rd-video-volume') : options.volume;
        muted = this.$element.attr('data-rd-video-muted') ? ctx.$element.attr('data-rd-video-muted') === 'true' : options.muted;
        playbackRate = this.$element.attr('data-rd-video-pbrate') ? ctx.$element.attr('data-rd-video-pbrate') : options.playbackRate;
        controls = this.$element.attr('data-rd-video-controls') ? ctx.$element.attr('data-rd-video-controls') === 'true' : options.controls;
        preload = this.$element.attr('data-rd-video-preload') ? ctx.$element.attr('data-rd-video-preload') : options.preload;
        try {
          $video.prop({
            autoplay: autoplay,
            volume: ctx.$video2 != null ? ctx.$video[0].volume : volume,
            muted: ctx.$video2 != null ? ctx.$video.prop('muted') : muted,
            defaultMuted: ctx.$video2 != null ? ctx.$video.prop('muted') : muted,
            playbackRate: ctx.$video2 != null ? ctx.$video.prop('playbackRate') : playbackRate,
            defaultPlaybackRate: ctx.$video2 != null ? ctx.$video.prop('playbackRate') : playbackRate,
            controls: ctx.$video2 != null ? ctx.$video.prop('controls') : controls,
            preload: ctx.$video2 != null ? ctx.$video.prop('preload') : preload
          });
        } catch (error) {
          e = error;
          throw new Error(NOT_IMPLEMENTED_MSG);
        }
        ctx.started = false;
        ctx.applyListeners(ctx, $video);
        ctx.$wrapper.append($video);
      };


      /**
      * Apply event Listeners to video
      * @protected
      * @param {jQuery Object} $video
       */

      RDVideo.prototype.applyListeners = function(ctx, $video) {
        var fps, start, video;
        video = $video[0];
        ctx.tmp = ctx.$video2 != null ? false : true;
        start = 0;
        fps = ctx.options.fps - ctx.options.fps / 4;
        $video.one('canplaythrough.rd.video', function() {
          ctx.resize();
          ctx.$win.trigger('scroll');
          if (!isMobile) {
            ctx.$element.removeClass('loading');
          }
          if (ctx.$video2 != null) {
            ctx.$video2[0].currentTime = ctx.$video[0].currentTime;
            if (!ctx.isBG) {
              ctx.replaceVideo(ctx);
              ctx.started = true;
              ctx.play();
            }
          }
        }).one('playing.rd.video', function() {
          if (ctx.$video2 != null) {
            ctx.$video2[0].currentTime = ctx.$video[0].currentTime;
          } else if (!isMobile) {
            $video.css({
              visibility: 'visible',
              opacity: 1
            });
          }
          if (!ctx.isBG && !isMobile) {
            ctx.$element.removeClass('loading');
          }
          ctx.getFPS(ctx, video);
        }).on('waiting.rd.video', function() {
          if (isMobile) {
            return ctx.$element.addClass('loading');
          }
        }).on('ended.rd.video', function() {
          var loops;
          start = 0;
          loops = ctx.$element.attr('data-rd-video-loop') ? ctx.$element.attr('data-rd-video-loop') === 'true' : ctx.options.loop;
          if (loops) {
            video.play();
            $video.prop({
              loop: loops
            });
          }
          clearInterval(ctx.interval);
        }).on('play.rd.video', function() {
          ctx.$element.removeClass(ctx.classNames.paused).addClass(ctx.classNames.playing);
          if (isMobile && (ctx.timeout != null)) {
            clearTimeout(ctx.timeout);
          }
        }).on('pause.rd.video', function() {
          ctx.$element.removeClass(ctx.classNames.playing).addClass(ctx.classNames.paused);
          if (isMobile && (ctx.timeout != null)) {
            clearTimeout(ctx.timeout);
          }
        }).on('volumechange.rd.video', function() {
          if (ctx.$video[0].muted) {
            ctx.$element.addClass(ctx.classNames.muted);
          } else {
            ctx.$element.removeClass(ctx.classNames.muted);
          }
        }).on('loadeddata.rd.video', function() {
          if (!isMobile) {
            ctx.$element.removeClass('loading');
          }
          if (ctx.time != null) {
            video.currentTime = ctx.time;
            return ctx.play();
          }
        });
        $video.on('timeupdate.rd.video', function() {
          var curr;
          if (isMobile) {
            ctx.$element.removeClass('loading');
          }
          if (ctx.time != null) {
            return;
          }
          if (isMac && !ctx.started) {
            ctx.resize();
          }
          ctx.started = true;
          if (ctx.$element.hasClass('loading')) {
            ctx.$element.removeClass('loading');
          }
          if (isMobile) {
            $video.currentTime = 0;
            $video.css({
              visibility: 'visible',
              opacity: 1
            });
            return ctx.resize();
          } else {
            if ((ctx.$video2 != null) && !ctx.tmp && ctx.isBG) {
              ctx.$video2[0].currentTime = ctx.$video[0].currentTime;
              ctx.replaceVideo(ctx);
              ctx.tmp = true;
              start = 0;
              return;
            }
            curr = video.currentTime;
            if (start === 0) {
              start = curr;
              if (ctx.$video2 === null) {
                start += 3;
              }
            }
            if (curr > start + 1.5 && ctx.tmp) {
              if ((ctx.fps != null) && ctx.fps < fps && ctx.fps !== 0) {
                ctx.createVideo(ctx);
                ctx.tmp = false;
                $video.off('timeupdate.rd.video');
              }
            }
          }
        });
      };


      /**
      * Add Listener for play/pause button
      * @protected
       */

      RDVideo.prototype.applyPlayButton = function() {
        var ctx;
        ctx = this;
        ctx.$playBtn.on('click touchstart', function(e) {
          var isPaused;
          if (!ctx.started) {
            ctx.$element.addClass('loading');
          }
          e.preventDefault();
          isPaused = ctx.$video[0].paused;
          if (isPaused) {
            return ctx.play();
          } else {
            return ctx.pause();
          }
        });
      };


      /**
      * Add Listener for mute/unmute button
      * @protected
       */

      RDVideo.prototype.applyMuteButton = function() {
        var ctx;
        ctx = this;
        ctx.$muteBtn.on('click touchstart', function(e) {
          var isMuted;
          e.preventDefault();
          isMuted = ctx.$video.prop('muted');
          if (isMuted) {
            return ctx.unmute();
          } else {
            return ctx.mute();
          }
        });
      };


      /**
      * Changes video quality
      * @protected
      * @param {String} quality - video suffix
       */

      RDVideo.prototype.changeQuality = function(ctx, quality) {
        if (!ctx.$element.hasClass('loading')) {
          ctx.$element.addClass('loading');
          ctx.$video[0].pause();
          ctx.time = ctx.$video[0].currentTime;
          if (ctx.$video.find('source[type*="mp4"]').length) {
            ctx.$video.find('source[type*="mp4"]')[0].setAttribute('src', ctx.path + '-' + quality + '.mp4');
          }
          if (ctx.$video.find('source[type*="webm"]').length) {
            ctx.$video.find('source[type*="webm"]')[0].setAttribute('src', ctx.path + '-' + quality + '.webm');
          }
          if (ctx.$video.find('source[type*="ogg"]').length) {
            ctx.$video.find('source[type*="ogg"]')[0].setAttribute('src', ctx.path + '-' + quality + '.ogg');
          }
          ctx.$video[0].load();
        }
      };


      /**
      * Creates context menu and apply listeners
      * @protected
       */

      RDVideo.prototype.contextMenuBuilder = function() {
        var $contextmenu, content, ctx, j, len, qualText, suffix, suffixes;
        ctx = this;
        suffixes = ctx.getSuffixArray();
        $contextmenu = ctx.$context;
        content = '<h6>Quality:</h6>';
        content += '<ul>';
        for (j = 0, len = suffixes.length; j < len; j++) {
          suffix = suffixes[j];
          qualText = ctx.getQualityText(suffix);
          if (suffix === ctx.suffix) {
            content += '<li class="active" data-rd-quality="' + suffix + '">' + qualText + '</li>';
          } else {
            content += '<li data-rd-quality="' + suffix + '">' + qualText + '</li>';
          }
        }
        content += '</ul>';
        $contextmenu.find('.rd-video-context').append(content);
        $contextmenu.find('[data-rd-quality]').on('click', function(e) {
          var $this;
          $this = $(this);
          $contextmenu.removeClass('show');
          if (isMobile) {
            $contextmenu.appendTo(ctx.$wrapper);
          }
          if (!$this.hasClass('active')) {
            $contextmenu.find('.active').removeClass('active');
            $(this).addClass('active');
            ctx.changeQuality(ctx, this.getAttribute('data-rd-quality'));
          }
        });
        if (!isMobile) {
          ctx.$doc.on('contextmenu', function(e) {
            if (!$(e.target).is(ctx.$video)) {
              return $contextmenu.removeClass('show');
            }
          });
          ctx.$doc.on('click', function(e) {
            return $contextmenu.removeClass('show');
          });
          ctx.$video.on('contextmenu', $.proxy(ctx.onContext, this, ctx));
        } else {
          ctx.timeout = null;
          ctx.$doc.on('touchstart', function(e) {
            if ($(e.target).parents('.rd-video-context').length === 0) {
              $contextmenu.removeClass('show');
              $contextmenu.appendTo(ctx.$wrapper);
            }
          });
          ctx.$video.on('touchstart', function(e) {
            var fullscreen;
            fullscreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
            if (!fullscreen) {
              ctx.timeout = setTimeout(function() {
                $contextmenu.appendTo('body');
                return setTimeout(function() {
                  return $contextmenu.addClass('show');
                }, 10);
              }, 300);
            }
          });
          ctx.$doc.on('touchend', function(e) {
            clearTimeout(ctx.timeout);
          });
        }
      };


      /**
      * Sets position relative to mouse click
      * @protected
       */

      RDVideo.prototype.onContext = function(ctx, e) {
        var $contextmenu, ch, cw, cy, h, left, offl, offt, top, w, wh, x, y;
        e.preventDefault();
        $contextmenu = ctx.$context;
        offt = ctx.$element.offset().top;
        offl = ctx.$element.offset().left;
        w = ctx.$element.outerWidth();
        h = ctx.$element.outerHeight();
        cw = $contextmenu.find('.rd-video-context').outerWidth();
        ch = $contextmenu.find('.rd-video-context').outerHeight();
        wh = ctx.$win.height();
        x = e.pageX;
        y = e.pageY;
        cy = e.clientY;
        top = y - offt;
        left = x - offl;
        if ((top + ch > h && cy - ch > 0) || (cy + ch > wh && top - ch > 0)) {
          $contextmenu.css({
            'top': 'auto',
            'bottom': h - top
          });
        } else if (cy + ch < wh && top + ch < h) {
          $contextmenu.css({
            'top': top,
            'bottom': 'auto'
          });
        } else {
          $contextmenu.removeClass('show');
          return;
        }
        if (left + cw > w) {
          $contextmenu.css({
            'left': 'auto',
            'right': w - left
          });
        } else {
          $contextmenu.css({
            'left': left,
            'right': 'auto'
          });
        }
        $contextmenu.addClass('show');
      };


      /**
      * Returns text quality from video suffix
      * @protected
      * @param {String str}
       */

      RDVideo.prototype.getQualityText = function(str) {
        switch (str) {
          case 'xs':
            return '240p';
          case 'sm':
            return '360p';
          case 'md':
            return '480p';
          case 'lg':
            return '720p';
          case 'xlg':
            return '1080p';
          default:
            return '';
        }
      };


      /**
      * Stops video playing when it's not in viewport
      * @protected
       */

      RDVideo.prototype.onScroll = function(ctx) {
        var h, offt, scrt, wh;
        scrt = ctx.$win.scrollTop();
        offt = ctx.$element.offset().top;
        h = ctx.$element.outerHeight();
        wh = ctx.$win.height();
        if (!ctx.isBG) {
          ctx.$context.removeClass('show');
        }
        if (offt < scrt + wh && offt + h > scrt) {
          if (ctx.$element.hasClass(this.classNames.paused)) {
            ctx.play();
          }
        } else {
          if (ctx.$element.hasClass(this.classNames.playing)) {
            ctx.pause();
          }
        }
      };


      /**
      * Play video
      * @protected
       */

      RDVideo.prototype.play = function() {
        this.$video[0].play();
        if (this.$video2 != null) {
          this.$video2[0].play();
        }
      };


      /**
      * Pause video
      * @protected
       */

      RDVideo.prototype.pause = function() {
        this.$video[0].pause();
        if (this.$video2 != null) {
          this.$video2[0].pause();
        }
      };


      /**
      * Mute video
      * @protected
       */

      RDVideo.prototype.mute = function() {
        this.$video.prop('muted', true);
        if (this.$video2 != null) {
          this.$video2.prop('muted', true);
        }
      };


      /**
      * Unmute video
      * @protected
       */

      RDVideo.prototype.unmute = function() {
        this.$video.prop('muted', false);
        if (this.$video2 != null) {
          this.$video2.prop('muted', false);
        }
      };


      /**
      * Remove video from DOM
      * @protected
       */

      RDVideo.prototype.removeVideo = function(ctx) {
        clearInterval(ctx.interval);
        ctx.$video.remove();
        ctx.$video = null;
      };


      /**
      * Replace video
      * @protected
       */

      RDVideo.prototype.replaceVideo = function(ctx) {
        if (ctx.$video2 != null) {
          clearInterval(ctx.interval);
          ctx.$video2.addClass('transition');
          ctx.$video2.css({
            visibility: 'visible',
            opacity: 1
          });
          setTimeout(function() {
            ctx.fps = null;
            ctx.$video.remove();
            ctx.$video = ctx.$video2;
            ctx.getFPS(ctx, ctx.$video[0]);
            ctx.$video.on('contextmenu', $.proxy(ctx.onContext, this, ctx));
            ctx.$video2 = null;
            return ctx.tmp = true;
          }, ctx.options.transitionTime);
        }
      };


      /**
      * Checks if video plays with lagging
      * @protected
      * @param {HTML Element} video
       */

      RDVideo.prototype.getFPS = function(ctx, video) {
        var frames, prevTime, startTime, time;
        prevTime = 0;
        frames = 0;
        time = 0;
        startTime = video.currentTime;
        ctx.fps = 0;
        ctx.interval = setInterval(function() {
          var videoTime;
          if (!video.paused) {
            videoTime = video.currentTime;
            if (videoTime === startTime) {
              startTime = -1;
              return null;
            }
            if (time > 5000) {
              frames = 0;
              time = 0;
            }
            if (videoTime !== prevTime) {
              prevTime = videoTime;
              frames++;
            }
            time += 1000 / ctx.options.fps;
            return ctx.fps = Math.round(frames / time * 1000);
          }
        }, 1000 / ctx.options.fps);
        return null;
      };


      /**
      * Resize function
      * @protected
       */

      RDVideo.prototype.resize = function() {
        this.resizeVideo(this.$video);
        if (this.$video2 != null) {
          this.resizeVideo(this.$video2);
        }
      };


      /**
      * Resize video
      * @protected
      * @param {jQuery Object} $video
       */

      RDVideo.prototype.resizeVideo = function($video) {
        var $wrapper, video, videoHeight, videoWidth, wrapperHeight, wrapperWidth;
        $wrapper = this.$wrapper;
        wrapperHeight = $wrapper.outerHeight();
        wrapperWidth = $wrapper.outerWidth();
        if ($video != null) {
          video = $video[0];
          videoHeight = video.videoHeight;
          videoWidth = video.videoWidth;
          if (videoHeight === 0 || videoWidth === 0) {
            return;
          }
          if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
            $video.css({
              width: wrapperWidth,
              left: 0,
              height: 'auto'
            });
            $video.css({
              top: (wrapperHeight - video.offsetHeight) * (parseInt(this.position.y.replace('%', '')) / 100)
            });
          } else {
            $video.css({
              width: 'auto',
              height: wrapperHeight,
              top: 0
            });
            $video.css({
              left: (wrapperWidth - video.offsetWidth) * (parseInt(this.position.x.replace('%', '')) / 100)
            });
          }
        }
      };


      /**
      * Checks imgSize option for current suffix
      * @protected
       */

      RDVideo.prototype.getSuffixArray = function() {
        var arr, ref, suffix, value;
        arr = [];
        ref = this.imgSize;
        for (suffix in ref) {
          value = ref[suffix];
          if (value.length) {
            arr.push(suffix);
          } else {
            delete this.imgSize[suffix];
          }
        }
        return arr;
      };


      /**
      * Gets suffix based on window width
      * @protected
       */

      RDVideo.prototype.getSuffix = function() {
        var width;
        if (this.path != null) {
          width = this.$win.width();
          if (width > 1600 && this.imgSize['xlg'].length) {
            return 'xlg';
          } else if (width > 1199 && this.imgSize['lg'].length) {
            return 'lg';
          } else if (width > 991 && this.imgSize['md'].length) {
            return 'md';
          } else if (width > 767 && this.imgSize['sm'].length) {
            return 'sm';
          } else {
            return 'xs';
          }
        }
      };


      /**
      * Gets specific option of plugin
      * @protected
       */

      RDVideo.prototype.getOption = function(key) {
        var point, targetPoint;
        if (this.options.responsive != null) {
          for (point in this.options.responsive) {
            if (point <= this.$win.width()) {
              targetPoint = point;
            }
          }
          if (this.options.responsive[targetPoint][key] != null) {
            return this.options.responsive[targetPoint][key];
          } else {
            return this.options[key];
          }
        } else {
          return this.options[key];
        }
      };

      return RDVideo;

    })();

    /**
     * The jQuery Plugin for the RDVideo
     * @public
     */
    $.fn.extend({
      RDVideo: function(options) {
        return this.each(function() {
          var $this;
          $this = $(this);
          if (!$this.data('RDVideo')) {
            return $this.data('RDVideo', new RDVideo(this, options));
          }
        });
      }
    });
    return window.RDVideo = RDVideo;
  })(window.jQuery, document, window);


  /**
   * The Plugin AMD export
   * @public
   */

  if (typeof module !== "undefined" && module !== null) {
    module.exports = window.RDVideo;
  } else if (typeof define === 'function' && define.amd) {
    define(["jquery"], function() {
      'use strict';
      return window.RDVideo;
    });
  }

}).call(this);
