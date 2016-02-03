<h2 class="item1">Интеграция с Require.js</h2>

<h5>
    Скрипт имеет встроенную поддержку AMD экспорта для интеграции с Require.js. Весь процесс интеграции все также
    сводится к нескольким простым шагам.
</h5>

<h3>
    Скачайте скрипт из Git'a
</h3>

<p>
    Для начала необходимо скачать данный скрипт из нашего публичного репозитория:
    <a href="http://products.git.devoffice.com/coding-development/rd-parallax">Кликабельно</a>
</p>

<h3>
    Подготовьте видео для вставки
</h3>

<p>
    Для адаптации качества видео под скорость интернета и производительность необходимо до 5 вариантов видео в различных
    разрешениях. Разрешение видео определяется суффиксом, который приписывается к названию файла через тире. Например:
    <strong>templatemonster-xs.mp4</strong> или <strong>templatemonster-sm.mp4</strong>. Наличие суффикса является обязательным.
    Ниже показаны разрешения и соответсвующие им суффиксы:
</p>

<ul class="marked-list">
    <li><strong>xs</strong> - 240px по меньшей стороне</li>
    <li><strong>sm</strong>  - 360px по меньшей стороне</li>
    <li><strong>md</strong>  - 480px по меньшей стороне</li>
    <li><strong>lg</strong>  - 720px по меньшей стороне(HD)</li>
    <li><strong>xlg</strong>  - 1080px по меньшей стороне(Full HD)</li>
</ul>

<p>Подготовка всех 5-ти вариантов видео необязательна, но желательна для адаптации видео. </p>


<h3>
    Добавьте необходимую разметку
</h3>

<p>
    HTML разметка по умолчанию для создания видео выглядит следующим образом.
</p>

<code>
<pre>
&lt;!-- RD Video --&gt;
&lt;div class="rd-video" data-rd-video-path="video/templatemonster" data-rd-video-image-xs="33.1"
             data-rd-video-image-sm="33.1" data-rd-video-image-md="33.1" data-rd-video-image-lg="53.4"
             data-rd-video-image-xlg="133"&gt;
        ...
&lt;/div&gt;
&lt;!-- END RD Video--&gt;
</pre>
</code>

<p>
    <strong>Обратите внимание:</strong> Путь к видео должен быть записан без суффиксов и расширений. Подробное описание
                                        аттрибутов указано в настройках скрипта.
</p>


<h3>
    Подключите стили
</h3>

<p>
    Подключите файл стилей rd-video.css в секции &lt;head/&gt; целевой страницы.
</p>

<code>
<pre>
&lt;link rel="stylesheet" href="path/to/css/rd-video.css"&gt;
</pre>
</code>

<h3>
    Обновите конфигурацию require.js
</h3>

<p>
    Прежде всего вам нобходимо убедиться в правильности настройки конфигурации путей в require.js. Обязательно необходимо
    определить алиасы jquery и jquery.rd-parallax. В большинстве случаев, данная конфигурация определяется в главном скрипте
    приложения, путь к которому определяется в дата атрибуте data-main при подключении require.js
</p>

<code>
<pre>
&lt;script data-main="js/main" src="js/require.js"&gt;&lt;/script&gt;
</pre>
</code>

<p>
    Сама конфигурация должна содержать следующие алиасы для путей
</p>

<code>
<pre>
requirejs.config({
  paths: {
    "jquery": "path/to/jquery"
    "jquery.rd-video": "path/to/jquery.rd-video"
  }
});
</pre>
</code>

<h3>
    Выполните инициализацию скрипта
</h3>

<p>
    Для инициализации скрипта достаточно воспользоваться следующим кодом.
</p>

<code>
<pre>
requirejs(["jquery", "jquery.rd-video"], function($, video) {
  var o = $(".rd-video");
  o.RDVideo();
});
</pre>
</code>

