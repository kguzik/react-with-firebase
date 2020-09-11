import React, { useState, useEffect, Fragment } from 'react';
import firebase from '../firebase';
import { v4 as uuidv4 } from 'uuid';

function SnapshotFirebase(){
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [population, setPopulation] = useState(0);

  const ref = firebase.firestore().collection('cities');

  function getCities(){
    setLoading(true);
    ref.onSnapshot(querySnapshot => {
      const items = [];
      querySnapshot.forEach(element => {
        items.push(element.data());
      });
      setCities(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getCities();
  }, []);

  function addCities(newCity){
    ref.doc(newCity.id).set(newCity).catch(err => console.log(err));
  }

  function editCities(updateCity){
    ref.doc(updateCity.id).update(updateCity).catch(err => console.log(err));
  }

  function deleteCities(city) {
    ref.doc(city.id).delete().catch(err => console.log(err));
  }

  if(loading){
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <Fragment>
    <div className="App">
      <h1>Cities with population</h1>
      <div className="inputBox">
        <h3>Add New</h3>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCity(e.target.value)}
        />
         <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
          <input
          type="text"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
        />
        <button onClick={() => addCities({ cityName, country, population, id: uuidv4() })}>
          Submit
        </button>
      </div>
      <hr />
      <ul>
      {cities.map(city => (
        <li className="city" key={city.id}>{city.cityName} ({city.country}) - Population: <strong>{city.population}</strong>
        <button onClick={() => editCities({ cityName: city.cityName, country: city.country, population, id: city.id })}>Edit</button>
        <button onClick={() => deleteCities(city)}>Delete</button>
        </li>
      ))}
      </ul>
    </div>
    </Fragment>
  );
}

export default SnapshotFirebase;