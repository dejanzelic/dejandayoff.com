---
---

var disqus_loaded = false;

function load_disqus()
{
    disqus_loaded = true;
    var disqus_shortname = '{{site.disqus_sitename}}';
    var disqus_title = document.getElementsByClassName('post-title')[0].innerHTML;
    var disqus_url = window.location.pathname;
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    var ldr = document.getElementById('disqus_loader');
};    

window.onscroll = function(e) {
   if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 800)) {
        //hit bottom of page
        if (disqus_loaded==false)
            load_disqus()
   }
};
