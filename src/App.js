import React, { useEffect, useState } from "react";
import "./App.css";
//import NavBar from "./component/NavBar";

//auth using amplify
import Amplify, { API, Auth } from "aws-amplify";
import awsconfig from "./aws-exports.js";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsconfig);

export default () => {
  const [id, setId] = useState("");
  const [petName, setpetName] = useState("");
  const [petType, setpetType] = useState("");
  const [petDelete, setpetDelete] = useState("");
  const [pets, setPets] = useState([]);
  const [lastpetID, setLastPetID] = useState("");
  const myPet = 'Loki'

  const [userSubId, setuserSubId] = useState();

  useEffect(() => {
    //setuserSubId(userSub());
    
    //to get all the data from the DB whenever the app loads
    
    API.get("todosApi","/todos/id", {}).then((petResp) => {
      console.log(petResp)
      setPets([...pets, ...petResp]);
    }).catch(err => {
      console.log(err);
    });
  }, []);
  
  //to post the user Entered data to the DB

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("todosApi", "/todos", {
      body: {
        id: id,
        name: petName,
        type: petType,
      },
    }).then((result) => {
      setPets([{ name: petName, type: petType }, ...pets]);
      console.log(result)
      // setLastPetID(result.body.name)
    });
  };
  
  //to delete an entry from the DB with id=1

  const deleteHandler = (e) => {
    e.preventDefault();

    API.del("todosApi", `/todos/1`, {})
      .then((resp) => {
        console.log('deleted')
        console.log(resp);
        setPets(...pets, ...resp)
        //setLastPetID("");
      
      })
      .catch((error) => console.log(error.resp));
  };
  
  //to update the existing entries in the database

  const updateHandler = (e) => {
    e.preventDefault();

    API.put('todosApi', '/todos', {
      body: {
        id: '4',
        name: "Test",
        type: ''
      }
    }).then(result => {
      console.log('Updated');
      //setPets(...pets, ...result);
    }).catch(err => console.log(err))
  }

  async function getToken() {
    return( await Auth.currentSession()).getIdToken().getJwtToken();
  }

  async function userSub() {
    return (await Auth.currentUserCredentials()).identityId;
  }

  return (
    <Authenticator hideSignUp={true}>
      {({ signOut, user }) => (
        <div className="App">
          <header>
            Hello There
            {/* {console.log(userSubId)} */}
            <form onSubmit={handleSubmit}>
            <input
                value={id}
                placeholder="id"
                onChange={(e) => setId(e.target.value)}
              />
              <input
                value={petName}
                placeholder="name"
                onChange={(e) => setpetName(e.target.value)}
              />
              <input
                value={petType}
                placeholder="type"
                onChange={(e) => setpetType(e.target.value)}
              />
              <button>Add Instance</button>
            </form>
            <form onSubmit={deleteHandler}>
              
              <button>Delete Instance</button>
            </form>
            <form onSubmit={updateHandler}>
              
              <button>Update Instance</button>
            </form>
            
            <ul>
              {pets.map((pet, i) => (
                <li key={i}>{pet.name}</li>
              ))}
            </ul>
            <button onClick={signOut}>Sign out</button>
          </header>
        </div>
      )}
     </Authenticator>
  )
}
