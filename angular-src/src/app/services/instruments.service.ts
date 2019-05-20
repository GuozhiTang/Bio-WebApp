import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstrumentsService {

  constructor(
    private http:Http
  ) { }

  /**
   * Function to get all instruments locally
   */
  getInstruments() {
    let headers = new Headers();
    return this.http.get('http://localhost:3000/instruments/getInstruments', {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Function to get all instruments remotely
   */
  getremoteInstruments() {
    let headers = new Headers();
    return this.http.get('http://10.253.7.14:8000/?request=getAllInstruments', {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Function to add instrument to the instruments
   * @param instruments: json sent to local server conatining all information for adding new instrument
   */
  addInstrument(instruments) {
    // Set header values
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/addInstrument', instruments, {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Function to grab instruments remotely
   */
  grabInstruments () {
    // Set header values
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/grabInstruments', {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Search Instruments by moduleName
   * @param moduleName: json sent to local server conatining moduleName
   */
  searchInstrumentsBymoduleName(moduleName) {
    // this.searchUrl = 'https://api.spotify.com/v1/search?query='+str+'&offset=0&limit=20&type='+type+'&market=US';
    // return this.http.get(this.searchUrl)
    //   .pipe(map(res => res.json()));
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/searchbymoduleName', moduleName, {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Search Instruments by short
   * @param short: json sent to local server conatining short
   */
  searchInstrumentsByShort(short) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/searchbyshort', short, {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Search Instruments by instrument_id
   * @param id: json sent to local server conatining instrument_id
   */
  searchInstrumentsById(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/searchbyid', id, {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Search Instrumenbrts by both moduleName and short
   * @param conditions: json sent to local server conatining moduleName and short
   */
  searchInstrumentsByConditions(conditions) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/instruments/searchbyconditions', conditions, {headers: headers})
      .pipe(map(res => res.json()));
  }
}