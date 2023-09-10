import React from "react";

export default function UserImage({ slika, setSlika }) {
  const handleImageLoad = async (e) => {
    const base64 = await convertBase64(e.target.files[0]);
    setSlika(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <div className="field" >
        <img
          className="ui centered medium image"
          src={slika}
          alt="file preview"
          style={{ width: '150px', height: '150px'}}
        ></img>
      </div>
      <div>
        <input
          type="file"
          className="custom-file-input"
          onChange={handleImageLoad}
        ></input>
      </div>
    </>
  );
}