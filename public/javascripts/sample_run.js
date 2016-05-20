
(function() {


  var container = $('.image-container'),
      generationsIndicator = $('.number-of-generations'),
      images = $('.image-list img'),
      numberOfImages = images.length,
      currentImage = 0;

  function setImage() {
    var image = images.eq(currentImage);
        numberOfGenerations = image.attr('src').match(/\d+/)[0];
    container.find('img').replaceWith(image);
    generationsIndicator.text(
      generationsIndicator.text().replace(/\d+/, numberOfGenerations));
  }

  function nextImage() {
    if (currentImage < images.length - 1) {
      currentImage++;
      setImage();
    }
  }

  function prevImage() {
    if (currentImage > 0) {
      currentImage--;
      setImage();
    }
  }

  setImage();

  $(document).on('keydown', function(event) {
    if (event.key === 'ArrowRight') {
      nextImage();
    }
    if (event.key === 'ArrowLeft') {
      prevImage();
    }
  });
}());
