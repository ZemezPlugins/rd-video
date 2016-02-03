# RD Video

The plugin allows you to add video as a background or as a video player in your template. 
The main feature of this script is an adaptation of the video quality for internet speed and perfomance.

Check out this [Demo](http://cms.devoffice.com/coding-dev/rd-video/demo/) to see it in action!

Extended documentation is available here: [Documentation](http://cms.devoffice.com/coding-dev/rd-video/documentation/)

## Setup
The HTML markup is really simple. Here is an example:

```html
<!-- RD Video -->
<div class="rd-video" data-rd-video-path="video/black&white" data-rd-video-image-xs="33.1" data-rd-video-loop="true"
            data-rd-video-image-lg="53.4" data-rd-video-image-xlg="133" data-rd-video-hide="true"
            data-rd-video-background="true" data-rd-video-controls="false" data-rd-video-position="center">
<!-- Content for Background Video (any HTML Markup) -->
</div>
<!-- END RD Video -->
```

Apply the video styles

```html
<link rel="stylesheet" href="path/to/css/jquery.rd-video.css">
```

Include jquery.rd-video.js

```html
<script src="path/to/js/jquery.rd-video.min.js">
```

Finally, initialize the script

```js
$(document).ready(function () {
    $('.rd-video').RDVideo({}); // Additional options
});
```

## License
Licensed under dual [CC By-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
and [GPLv3](http://www.gnu.org/licenses/gpl-3.0.ru.html)

