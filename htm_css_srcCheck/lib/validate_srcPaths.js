
    var srcFrom = // object
    {
        html:function(str)
        {
            var prs = new DOMParser();
            var obj = prs.parseFromString(str, 'text/html');
            var rsl = [], nds;

            ['data', 'href', 'src'].forEach(function(atr)
            {
                nds = [].slice.call(obj.querySelectorAll('['+atr+']'));
                nds.forEach(function(nde)
                { rsl[rsl.length] = nde.getAttribute(atr); });
            });

            return rsl;
        },

        css:function(str)
        {
            var css = document.createElement('style');
            var rsl = [], nds, tmp;

            css.id = 'cssTest';
            css.innerHTML = str;
            document.head.appendChild(css);
            css = [].slice.call(document.styleSheets);

            for (var idx in css)
            {
                if (css[idx].ownerNode.id == 'cssTest')
                {
                    [].slice.call(css[idx].cssRules).forEach(function(ssn)
                    {
                        ['src', 'backgroundImage'].forEach(function(pty)
                        {
                            if (ssn.style[pty].length > 0)
                            {
                                tmp = ssn.style[pty].slice(4, -1);
                                tmp = tmp.split(window.location.pathname).join('');
                                tmp = tmp.split(window.location.origin).join('');
                                tmp = ((tmp[0] == '/') ? tmp.substr(1) : tmp);
                                rsl[rsl.length] = tmp;
                            }
                        });
                    });

                    break;
                }
            }

            css = document.getElementById('cssTest');
            css.parentNode.removeChild(css);
            return rsl;
        }
    };


    function check_file(url, cbf)
    {
        var xhr = new XMLHttpRequest();
        var uri = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function()
        {
            var ext = url.split('.').pop();
            var lst = srcFrom[ext](this.response);
            var rsl = [null, null], nds;

            var Break = {};

            try
            {
                lst.forEach(function(tgt)
                {
                    uri.open('GET', tgt, false);
                    uri.send(null);

                    if (uri.statusText != 'OK')
                    {
                        rsl = [uri.statusText, tgt];
                        throw Break;
                    }
                });
            }
            catch(e){}

            cbf(rsl[0], rsl[1]);
        };

        xhr.send(null);
    }
