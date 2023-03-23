import { api, baseUrl, formApi } from "@/services/api";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ChangeEvent, useState } from "react";
import { fireStorage } from "@/services/firebase";
const { v4: uuidv4 } = require("uuid");

const Test = () => {

  const [onValue, setOnValue] = useState<File[]>([]);
  const [image, setImage] = useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files?.length === 0 || e.target.files === undefined) return;

    let reader = new FileReader();
    let file = e.target.files[0];

    setOnValue([file])
  }

  const test = async () => {

    const fire = fireStorage;
    let uid = uuidv4();
    const storage = getStorage();

    const storageRef = ref(storage)

    const imageRef = ref(storageRef, "cover");

    const spaceRef = ref(imageRef, uid + "-" + onValue[0].name);

    await uploadBytes(spaceRef, onValue[0])
    .then(async snapshot => {
      await getDownloadURL(ref(storage, snapshot.metadata.fullPath))
      .then(_url => {
        console.log(_url);
      })
      .catch(err => console.log("GET DOWNLOAD ERR", err));
    })
    .catch(err => console.log("Snapshot Err", err));

    // const res = await fetch(baseUrl+"test/fileAdd", {
    //   body: formData,
    //   method: "POST",
    //   headers: {}
    // })
    
    // await api.post("/test/fileAdd", formData)
    // .then(edit => {
    //   console.log("양호");
    //   console.log(edit);
    //   setImage(edit.data.data);
    // })
    // .catch(err => console.log("why", err))
  }

  return (
      <article>
          <div style={{width: "150px", height: "150px"}}>
            <input type="file" accept="image/*" onChange={onChange} />
          </div>
          
          {
            image && <img src={image} alt="TEST" />
          }
          <button onClick={test}>GOGO</button>
      </article>
  );
}
  
export default Test;