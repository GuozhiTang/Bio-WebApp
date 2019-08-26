import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
// import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // have a couple of properties in the auth service
  authToken: any;
  operator: any;
  // user: any;

  // Inject the modules into the constructor
  constructor(
    private http:Http,
    public jwtHelper:JwtHelperService
    ) { }

  /**
   * Authenticate the login information for the specific operator.
   * @param operator: json sent to local server conatining all information for authenticating existed operators.
   */
  authenticateOperator(operator) {
    // Set header values
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/operators/authenticate', operator, {headers: headers})
    // return this.http.post('operators/authenticate', operator, {headers: headers})
      .pipe(map(res => res.json()));
  }

  /**
   * Load the data in local storage and set it as current user.
   * Before login there should be a null user from users/nulluser.
   */
  getProfile() {
    // Set header values
    let headers = new Headers();
    this.loadToken();
    if (this.authToken) {
      // console.log("We can access here!!!");
      // Use the token here
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.get('http://localhost:3000/operators/profile', {headers: headers})
      // return this.http.get('operators/profile', {headers: headers})
        .pipe(map(res => res.json()));
    } else {
      headers.append('Content-Type','application/json');
      return this.http.get('http://localhost:3000/operators/nulloperator', {headers: headers})
      // return this.http.get('operators/nulloperator', {headers: headers})
        .pipe(map(res => res.json()));
    }
  }

  /**
   * Store login information in local storage
   * @param token: the token information of authentication
   * @param operators: the operators information of login user
   */
  storeUserData(token, operators) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('operator', JSON.stringify(operators));
    this.authToken = token;
    this.operator = operators;
  }

  /**
   * Get token from local storage
   */
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // loggedIn() {
  //   return tokenNotExpired();
  // }

  /**
   * Judge whether the token of login user has expired.
   */
  isTokenExp(){
    return this.jwtHelper.isTokenExpired();
  }

  /**
   * Functionality of logout and set token and user information as null. Finally clear up the local storage.
   */
  logout() {
    this.authToken = null;
    // this.user = null;
    this.operator = null;
    localStorage.clear();
  }

  /**
   * Authenticate the login information for the specific user.
   * @param user: json sent to local server conatining all information for authenticating existed users.
   */
  // authenticateUser(user) {
  //   // Set header values
  //   let headers = new Headers();
  //   headers.append('Content-Type','application/json');
  //   return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
  //   // return this.http.post('users/authent/icate', user, {headers: headers})
  //     .pipe(map(res => res.json()));
  // }
}