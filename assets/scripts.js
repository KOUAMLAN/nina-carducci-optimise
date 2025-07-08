(function($) {
    $(function() {
        var $gallery = $('.gallery');
        if ($gallery.length && typeof $.fn.mauGallery === 'function') {
            $gallery.mauGallery({
                columns: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3 },
                lightBox: true,
                lightboxId: 'myAwesomeLightbox',
                showTags: true,
                tagsPosition: 'top'
            });
        }
        var $menuToggle = $('.navbar-toggler');
        var $navbarMenu = $('.navbar-collapse');
        if ($menuToggle.length && $navbarMenu.length) {
            $menuToggle.on('click', function() {
                $navbarMenu.toggleClass('is-open');
            });
        }
    });
})(jQuery);