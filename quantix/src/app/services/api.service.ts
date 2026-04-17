import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const BASE_URL = 'https://quantitymeasurementapp-pj8a.onrender.com/api';

export interface LoginRequest    { email: string; password: string; }
export interface RegisterRequest { username: string; email: string; password: string; }
export interface AuthResponse    { token: string; username: string; email: string; role: string; }
export interface UpdatePasswordRequest { currentPassword: string; newPassword: string; confirmNewPassword: string; }
export interface UpdateRoleRequest    { email: string; newRole: string; }
export interface HistoryItem {
  id: number; category: string; operation: string;
  value1: number; unit1: string; value2?: number; unit2?: string;
  resultValue: number; resultUnit: string; createdAt: string; userId?: number;
}
export interface UserInfo { id: number; username: string; email: string; role: string; createdAt: string; }

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private headers(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // AUTH
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, data);
  }
  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/auth/register`, data);
  }
  updatePassword(data: UpdatePasswordRequest): Observable<any> {
    return this.http.put<any>(`${BASE_URL}/auth/update-password`, data, { headers: this.headers() });
  }
  updateRole(data: UpdateRoleRequest): Observable<any> {
    return this.http.put<any>(`${BASE_URL}/auth/update-role`, data, { headers: this.headers() });
  }
  getAllUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${BASE_URL}/auth/users`, { headers: this.headers() });
  }

  // CALCULATOR
  convert(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/QuantityMeasurement/convert`, data, { headers: this.headers() });
  }
  compare(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/QuantityMeasurement/compare`, data, { headers: this.headers() });
  }
  add(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/QuantityMeasurement/add`, data, { headers: this.headers() });
  }
  subtract(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/QuantityMeasurement/subtract`, data, { headers: this.headers() });
  }
  divide(data: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/QuantityMeasurement/divide`, data, { headers: this.headers() });
  }

  // HISTORY
  getMyHistory(operation?: string, category?: string): Observable<HistoryItem[]> {
    let params = new HttpParams();
    if (operation) params = params.set('operation', operation);
    if (category)  params = params.set('category', category);
    return this.http.get<HistoryItem[]>(`${BASE_URL}/QuantityMeasurement/users/me/history`, { headers: this.headers(), params });
  }
  clearMyHistory(): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/QuantityMeasurement/users/me/history`, { headers: this.headers() });
  }

  // ADMIN
  getAllHistory(operation?: string, category?: string): Observable<HistoryItem[]> {
    let params = new HttpParams();
    if (operation) params = params.set('operation', operation);
    if (category)  params = params.set('category', category);
    return this.http.get<HistoryItem[]>(`${BASE_URL}/QuantityMeasurement/admin/history`, { headers: this.headers(), params });
  }
  getHistoryByUser(userId: number): Observable<HistoryItem[]> {
    return this.http.get<HistoryItem[]>(`${BASE_URL}/QuantityMeasurement/admin/history/user/${userId}`, { headers: this.headers() });
  }
  deleteRecord(id: number): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/QuantityMeasurement/admin/history/${id}`, { headers: this.headers() });
  }
  clearAllHistory(): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/QuantityMeasurement/admin/history`, { headers: this.headers() });
  }
}