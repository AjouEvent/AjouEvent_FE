import React, { useState } from 'react';

const EventUpload = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/api/file/multiple-presigned-urls?prefix=${title}&fileCount=${images.length}`,
        { method: 'POST' },
      );
      if (!response.ok) throw new Error('Failed to fetch presigned URLs');
      const data = await response.json();
      await Promise.all(
        images.map(async (image, index) => {
          const presignedUrl = data[index].url;
          const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': image.type },
            body: image,
          });
          if (!uploadResponse.ok) throw new Error(`Failed to upload image ${index + 1}`);
        }),
      );
      const urls = data.map((item) => item.url.split('?')[0]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Content:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Images:
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </label>
      </div>
      <div>
        {imagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index}`} className="w-[100px] h-auto m-1" />
        ))}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventUpload;
