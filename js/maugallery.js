(function($) {
  $.fn.mauGallery = function(options) {
    options = $.extend({}, $.fn.mauGallery.defaults, options);
    let tagsCollection = [];
    return this.each(function() {
      const $gallery = $(this);
      $.fn.mauGallery.methods.createRowWrapper($gallery);
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox($gallery, options.lightboxId, options.navigation);
      }
      $gallery.children(".gallery-item").each(function() {
        const $item = $(this);
        $.fn.mauGallery.methods.responsiveImageItem($item);
        $.fn.mauGallery.methods.moveItemInRowWrapper($item);
        $.fn.mauGallery.methods.wrapItemInColumn($item, options.columns);
        const theTag = $item.data("gallery-tag");
        if (options.showTags && theTag !== undefined && !tagsCollection.includes(theTag)) {
          tagsCollection.push(theTag);
        }
      });
      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags($gallery, options.tagsPosition, tagsCollection);
      }
      $.fn.mauGallery.listeners($gallery, options);
      $gallery.fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function($gallery, options) {
    $gallery.on("click", ".gallery-item", function() {
      if (options.lightBox && $(this).is("img")) {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      }
    });
    $gallery.on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $gallery.on("click", ".mg-prev", function() {
      $.fn.mauGallery.methods.prevImage(options.lightboxId);
    });
    $gallery.on("click", ".mg-next", function() {
      $.fn.mauGallery.methods.nextImage(options.lightboxId);
    });
  };
  $.fn.mauGallery.methods = {
    createRowWrapper($gallery) {
      if ($gallery.find(".gallery-items-row").length === 0) {
        $gallery.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn($item, columns) {
      let columnClasses = '';
      if (typeof columns === "number") {
        columnClasses = `col-${Math.ceil(12 / columns)}`;
      } else if (typeof columns === "object") {
        if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        if (columns.sm) columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        if (columns.md) columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        if (columns.lg) columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        if (columns.xl) columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
      }
      $item.wrap(`<div class="item-column mb-4 ${columnClasses.trim()}"></div>`);
    },
    moveItemInRowWrapper($item) {
      $item.appendTo(".gallery-items-row");
    },
    responsiveImageItem($item) {
      if ($item.is("img")) {
        $item.addClass("img-fluid");
      }
    },
    openLightBox($img, lightboxId) {
      const id = lightboxId || "galleryLightbox";
      $(`#${id} .lightboxImage`).attr("src", $img.attr("src"));
      $(`#${id}`).modal("show");
    },
    prevImage(lightboxId) {
      const id = lightboxId || "galleryLightbox";
      const currentSrc = $(`#${id} .lightboxImage`).attr("src");
      const activeTag = $(".tags-bar .active-tag").data("images-toggle");
      let images = [];
      $(".item-column img.gallery-item").each(function() {
        const $img = $(this);
        if (activeTag === "all" || $img.data("gallery-tag") === activeTag) {
          images.push($img);
        }
      });
      let index = images.findIndex($img => $img.attr("src") === currentSrc);
      index = (index - 1 + images.length) % images.length;
      $(`#${id} .lightboxImage`).attr("src", images[index].attr("src"));
    },
    nextImage(lightboxId) {
      const id = lightboxId || "galleryLightbox";
      const currentSrc = $(`#${id} .lightboxImage`).attr("src");
      const activeTag = $(".tags-bar .active-tag").data("images-toggle");
      let images = [];
      $(".item-column img.gallery-item").each(function() {
        const $img = $(this);
        if (activeTag === "all" || $img.data("gallery-tag") === activeTag) {
          images.push($img);
        }
      });
      let index = images.findIndex($img => $img.attr("src") === currentSrc);
      index = (index + 1) % images.length;
      $(`#${id} .lightboxImage`).attr("src", images[index].attr("src"));
    },
    createLightBox($gallery, lightboxId, navigation) {
      const id = lightboxId || "galleryLightbox";
      if ($(`#${id}`).length) return;
      $gallery.append(`
        <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body position-relative">
                ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;z-index:2;">&lt;</div>' : ''}
                <img class="lightboxImage img-fluid d-block mx-auto" alt="Image affichée dans la modale"/>
                ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;z-index:2;">&gt;</div>' : ''}
              </div>
            </div>
          </div>
        </div>
      `);
    },
    showItemTags($gallery, position, tags) {
      let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      tags.forEach(tag => {
        tagItems += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
      });
      const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
      if (position === "bottom") {
        $gallery.append(tagsRow);
      } else if (position === "top") {
        $gallery.prepend(tagsRow);
      }
    },
    filterByTag() {
      const $clicked = $(this);
      if ($clicked.hasClass("active-tag")) return;
      $clicked.closest(".tags-bar").find(".active-tag").removeClass("active active-tag");
      $clicked.addClass("active active-tag");
      const tag = $clicked.data("images-toggle");
      $(".gallery-item").each(function() {
        const $img = $(this);
        const $column = $img.closest(".item-column");
        if (tag === "all" || $img.data("gallery-tag") === tag) {
          $column.show(300);
        } else {
          $column.hide(300);
        }
      });
    }
  };
})(jQuery);
