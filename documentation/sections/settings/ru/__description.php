<h2 class="item1">Настройки скрипта</h2>

<h5>
    Скрипт поддерживает следующие опции для настройки
</h5>

<h3>
    Общие настройки
</h3>

<p>
    Общие настройки скрипта определяются в объекте options при инициализации.
</p>

<h5>position</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>50% 50%</dd>
</dl>

<p>
    Используется для определения начального положения видео. Работает по принципу css-свойства background-position.
</p>

<h5>volume</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Number</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>0.5</dd>
</dl>

<p>
    Определяет громкость видео. Некоторые мобильные устройства игнорируют данное свойство и всегда воспроизводят с
    громкостью, установленной на устройстве.
</p>

<h5>playbackRate</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Number</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>1</dd>
</dl>

<p>
    Определяет скорость проигрывания видео. Некоторые мобильные устройства игнорируют данное свойство и всегда
    воспроизводят видео в стандартной скорости.
</p>

<h5>muted</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает звук в видео. Если true - звук будет отключен.
</p>

<h5>loop</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает зацикливание видео.
</p>

<h5>autoplay</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает автовоспроизведение видео. Мобильные устройства игнорируют данную опцию.
</p>

<h5>transitionTime</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Number</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>300</dd>
</dl>

<p>
    Время в мс равное css свойству transition указанному на тег video. Используется для "незаметной" подмены видео в
    случае несоответствия качества.
</p>

<h5>posterType</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>jpg</dd>
</dl>

<p>
    Расширение фоновой картинки.
</p>

<h5>path</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>video/video</dd>
</dl>

<p>
    Путь к видеофайлам и постерам. Указывается без расширений и суффиксов.
</p>
<h5>background</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Определяет назначение видео. Если true - видео будет проигрываться на фоне, иначе как видеоплеер.
</p>

<h5>controls</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>false</dd>
</dl>

<p>
    Включает\отключает стандартную панель управления видео. Не работает в случае с фоновым видео.
</p>


<h5>hideWhenSlow</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>false</dd>
</dl>

<p>
    Включает\отключает возможность замены видео на фоновую картинку в случае с подтормаживанием видео.
</p>

<h5>imgSize</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Object</dd>
</dl>

<p>
    Составной обьект. Определяет размер постера для каждого видео в КБ и состоит из 5 следующих опций:
</p>

<div class="inner">
    <h6>xs</h6>
    <dl class="inline-term">
        <dt>Тип</dt>
        <dd>String</dd>
    </dl>

    <p>
        Размер постера для видео с суффиксом xs.
    </p>
    <h6>sm</h6>
    <dl class="inline-term">
        <dt>Тип</dt>
        <dd>String</dd>
    </dl>

    <p>
        Размер постера для видео с суффиксом sm.
    </p>
    <h6>md</h6>
    <dl class="inline-term">
        <dt>Тип</dt>
        <dd>String</dd>
    </dl>

    <p>
        Размер постера для видео с суффиксом md.
    </p>
    <h6>lg</h6>
    <dl class="inline-term">
        <dt>Тип</dt>
        <dd>String</dd>
    </dl>

    <p>
        Размер постера для видео с суффиксом lg.
    </p>

    <h6>xlg</h6>
    <dl class="inline-term">
        <dt>Тип</dt>
        <dd>String</dd>
    </dl>

    <p>
        Размер постера для видео с суффиксом xlg.
    </p>
</div>


<h3>
    Настройки с помощью Data атрибутов
</h3>

<p>
    Скрипт также поддерживает дополнительную настройку в HTML разметке с помощью data-атрибут API.
</p>


<h4>
    Добавление собственных кнопок для воспроизведения/паузы и включения/отключения видео.
</h4>

<p>
    Для создание собственной кнопки необходимо создать ссылку с аттрибутом data-rd-video-btn. Допустимые значения:
</p>

<ul class="marked-list">
    <li>play</li>
    <li>mute</li>
</ul>
<p>Например:</p>

<code>
<pre>
&lt;a data-rd-video-btn="play" href='#'&gt;&lt;/a&gt;
</pre>
</code>



<h5>data-rd-video-path</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>video/video</dd>
</dl>

<p>
    Путь к видеофайлам и постерам. Указывается без расширений и суффиксов.
</p>

<h5>data-rd-video-image-xs</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>

<p>
    Размер постера для видео с суффиксом xs.
</p>

<h5>data-rd-video-image-sm</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>

<p>
    Размер постера для видео с суффиксом sm.
</p>

<h5>data-rd-video-image-md</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>

<p>
    Размер постера для видео с суффиксом md.
</p>

<h5>data-rd-video-image-lg</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>

<p>
    Размер постера для видео с суффиксом lg.
</p>

<h5>data-rd-video-image-xlg</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>

<p>
    Размер постера для видео с суффиксом xlg.
</p>

<h5>data-rd-video-loop</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает зацикливание видео.
</p>

<h5>data-rd-video-autoplay</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает автовоспроизведение видео. Мобильные устройства игнорируют данную опцию.
</p>

<h5>data-rd-video-volume</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Number</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>0.5</dd>
</dl>

<p>
    Определяет громкость видео. Некоторые мобильные устройства игнорируют данное свойство и всегда воспроизводят с
    громкостью, установленной на устройстве.
</p>

<h5>data-rd-video-hide</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>false</dd>
</dl>

<p>
    Включает\отключает возможность замены видео на фоновую картинку в случае с подтормаживанием видео.
</p>

<h5>data-rd-video-background</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Определяет назначение видео. Если true - видео будет проигрываться на фоне, иначе как видеоплеер.
</p>

<h5>data-rd-video-controls</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>false</dd>
</dl>

<p>
    Включает\отключает стандартную панель управления видео. Не работает в случае с фоновым видео.
</p>

<h5>data-rd-video-muted</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Boolean</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>true</dd>
</dl>

<p>
    Включает\отключает звук в видео. Если true - звук будет отключен.
</p>

<h5>data-rd-video-pbrate</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>Number</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>1</dd>
</dl>

<p>
    Определяет скорость проигрывания видео. Некоторые мобильные устройства игнорируют данное свойство и всегда
    воспроизводят видео в стандартной скорости.
</p>

<h5>data-rd-video-poster</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>jpg</dd>
</dl>

<p>
    Расширение фоновой картинки.
</p>

<h5>data-rd-video-position</h5>
<dl class="inline-term">
    <dt>Тип</dt>
    <dd>String</dd>
</dl>
<dl class="inline-term">
    <dt>Значение по-умолчанию</dt>
    <dd>50% 50%</dd>
</dl>

<p>
    Используется для определения начального положения видео. Работает по принципу css-свойства background-position.
</p>

