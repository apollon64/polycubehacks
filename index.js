(function () {
    var toolbar_width = 0;
    // fullscreen: 1 = fullpreview, 2 = fullpreview+fullscreen
    function calculateLayout(console_enabled, fullscreen) {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var toolbar = document.getElementById('toolbar');
      if (!toolbar_width) {
        toolbar_width = toolbar.offsetWidth;
      }
      var main_padding = 10;
      var left_padding = 24;
      var logo_height = 64;
      var editor_width = Math.round((width - toolbar_width - main_padding) / 2);
      var editor_height = height - main_padding * 2 - logo_height;
      var preview_width = editor_width;
      var preview_height = editor_height;
      var console_width = editor_width;
      var console_height = Math.min(editor_height>>2, 100);
      if (console_enabled) {
        editor_height -= console_height + main_padding;
      }
      if (fullscreen === 2) {
        preview_width = width;
        preview_height = height;
      }
      else if (fullscreen === 1) {
        preview_width = width - main_padding - left_padding;
        preview_height = height - main_padding * 2;
      }
      return {
        editor_width: editor_width,
        editor_height: editor_height,
        preview_width: preview_width,
        preview_height: preview_height,
        console_width: console_width,
        console_height: console_height,
        console_enabled: console_enabled,
        toolbar_width: toolbar_width,
        main_padding: main_padding,
        left_padding: left_padding,
        fullscreen: fullscreen
      };
    }
    var prev_fullscreen = 0;
    function setLayout(layout) {
      var editor = document.getElementById('editor');
      var toolbar = document.getElementById('toolbar');
      var previewDiv = document.getElementById('preview');
      var consoleDiv = document.getElementById('console');
      var logoDiv = document.getElementById('logo');
      var mainDiv = document.getElementById('main');
      var titleDiv = document.getElementById('title');
      var leftbarDiv = document.getElementById('leftbar');
      var playerDiv = document.getElementById('player');
      if (layout.fullscreen) {
        mainDiv.style.top = '0px';
        consoleDiv.style.display = 'none';
        toolbar.style.display = 'none';
        editor.style.display = 'none';
        playerDiv.style.display = 'none';
        if (layout.fullscreen === 1) {
          previewDiv.style.left = layout.left_padding + 'px';
          previewDiv.style.top = layout.main_padding + 'px';
          logoDiv.style.display = 'none';
          titleDiv.style.display = 'none';
          var pos = layout.main_padding + (layout.preview_height>>1) - 20;
          leftbarDiv.style.top = pos + 'px';
          leftbarDiv.style.display = 'block';
        } else {
          previewDiv.style.left = '0px';
          previewDiv.style.top = '0px';
          logoDiv.style.display = 'none';
          titleDiv.style.display = 'none';
          leftbarDiv.style.display = 'none';
        }
        prev_fullscreen = layout.fullscreen;
        return;
      }
      toolbar.style.left = (layout.editor_width + layout.main_padding) + 'px';
      toolbar.style.visibility = 'visible';
      previewDiv.style.left = (layout.editor_width + layout.toolbar_width) + 'px';
      playerDiv.style.display = 'block';
      playerDiv.style.left = (layout.editor_width + layout.toolbar_width) + 'px';
      if (layout.console_enabled) {
        consoleDiv.style.display = 'block';
      } else {
        consoleDiv.style.display = 'none';
      }
      consoleDiv.style.left = '10px';
      consoleDiv.style.top = (layout.editor_height + layout.main_padding * 2) + 'px';
      if (prev_fullscreen) {
        toolbar.style.display = 'block';
        editor.style.display = 'block';
        logoDiv.style.display = 'block';
        titleDiv.style.display = 'block';
        leftbarDiv.style.display = 'none';
        mainDiv.style.top = '0px';
        previewDiv.style.top = '10px';
        editor.style.top = '10px';
        prev_fullscreen = false;
      }
    }
    function onResize(forced_resize) {
      var me = window.me;
      var fullscreen = 0;
      if (!me.isFullpreview) {
        fullscreen = me.isFullscreen() * 2; // obsolete
      }
      else {
        if (screen.width == window.innerWidth && screen.height == window.innerHeight) {
          if (!me.isFullpreview()) {
            fullscreen = 0;
          } else {
            fullscreen = 2;
          }
        }
        else if (me.isFullpreview()) {
          fullscreen = 1;
        }
      }
      var layout = calculateLayout(me.isConsoleEnabled(), fullscreen);
      setLayout(layout);
      me.onResize(layout);
    };
    var layout_manager = {
      refresh: function() { onResize(true); }
    };
    var layout = calculateLayout(false);
    setLayout(layout);
    window.me = new MEApplication({
      editor_width: layout.editor_width,
      editor_height: layout.editor_height,
      preview_width: layout.preview_width,
      preview_height: layout.preview_height,
      console_width: layout.console_width,
      console_height: layout.console_height,
      layout_manager: layout_manager
    });
    // Default rice source: only kicks in if no ?query file/hash and no
    // localStorage save already populated the editor during construction.
    if (window.location.href.indexOf('?') < 0 && !window.me.editor.getText().length) {
      window.me.downloadFile('examples/part1_framebuffer.rice');
    }
    window.onresize = function() { onResize(false); };
} ());
