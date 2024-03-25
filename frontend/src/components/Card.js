import { React, useState } from "react"; 
import UpdateForm from "./UpdateForm";
import UserService from "../services/user.service";
 

const Card = ({ file, fetchFiles }) => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleDelete = () => {
	UserService.deleteFile(file.id)
		.then((res) => {
			console.log(res.data.data);
		})
		.catch((err) => {
			console.log(err.response);
		});
  }; 
  return ( 
    <>
      <UpdateForm open={openUpdate} setOpen={setOpenUpdate} file={file} fetchFiles={fetchFiles} />

      <div className="max-w-sm rounded overflow-hidden shadow-ig border-2">
        <iframe
          style={{ height: "20rem" }}
          className="w-full"
          src={file.filePath}
          title={file.name}
        ></iframe>

	<div class = "inline-flex px-6 pb-3">
		<a 
			class = "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4"
			href = {file.filePath}
			download = {file.name}
			target = "_blank"
			rel = "noreferrer"
		>Download</a>
		<button
			class = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
			onClick={() => {
				setOpenUpdate(true);
			}}
			>

			</button>
	</div>

        <div className="px-6 py-4">
          <div className="font-bold text-x1 mb-2">{file.name}</div>
          <p className="text=gray-700 text-base">{file.description}</p>
        </div>
      </div>
    </>
  );
};

export default Card;  