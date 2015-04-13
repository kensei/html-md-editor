$(function() {
    marked.setOptions({
        langPrefix: '' // hilight-jsにlang-prefixをそのまま渡す
    });

    var ls = localStorage;

    function render(src) {
        var html = marked(src);
        $('#bodyresult').html(html);
        $('pre code').not('.math').each(function(i, block) {
            hljs.highlightBlock(block);
        });
        $('pre code.math').each(function(i, block) {
            var out = '';
            try {
                out = katex.renderToString($(this).text());
            } catch (e) {
                out = e.toString();
            }
            $(this).html(out);
        });
    }

    // onload section
    if (ls.getItem('body')!=null) {
        var src = ls.getItem('body');
        render(src);
        $('textarea#bodyeditor').val(src);
    };
    if (ls.getItem('title')!=null) {
        $('#titleresult h1').text(ls.getItem('title'));
        $('textarea#titleeditor').val(ls.getItem('title'));
    };

    // edit section
    $('#titleeditor').keyup(function() {
        var src = $(this).val();
        $('#titleresult h1').text(src);
        ls.setItem("title",src);
    });
    $('#bodyeditor').keyup(function() {
        var src = $(this).val();
        render(src);
        ls.setItem("body",src);
    });
    $('textarea').keydown(function(e) {
        // tab enter then
        if(e.keyCode == 9) {
             e.preventDefault(); // cancell
             var elem = e.target;
             var val = elem.value;
             var pos = elem.selectionStart;
             elem.value = val.substr(0, pos) + '  ' + val.substr(pos, val.length); // move 2 space
             elem.setSelectionRange(pos + 2, pos + 2); // cursol move right 2 space
        }
    });
    $(window).keydown(function(e) {
        if (event.ctrlKey) {
            switch (e.keyCode) {
                case 68: // ctl + d => remove
                    if (confirm('タイトル/ボディを全て削除しますか?')) {
                        $('#bodyeditor').val('');
                        $('#bodyresult').html('');
                        $('#titleeditor').val('');
                        $('#titleresult h1').text('');
                    }
                    break;
                case 13: // ctrl+enter => move textarea
                    if (document.activeElement.id == "titleeditor") {
                        $('#bodyeditor').focus();
                    } else if (document.activeElement.id == "bodyeditor") {
                        $('#titleeditor').focus();
                    }
                    return false;
                    break;
            };
        };
    })
});
