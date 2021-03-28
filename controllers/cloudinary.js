const cloudinary = require('cloudinary');

exports.upload = async (req, res) => {
  let images = [];
  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  let imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products',
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  res.json(imagesLink);
};

exports.remove = async (req, res) => {
  try {
    const image_id = req.params.public_id;
    await cloudinary.v2.uploader.destroy(image_id);
    res.send('ok');
  } catch (error) {
    res.status(400).send('Something went wrong');
  }
};
