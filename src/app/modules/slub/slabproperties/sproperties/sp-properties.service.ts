import {Injectable, PipeTransform} from '@angular/core';
import {SortDirection} from "../../../bbs/clients/my-clients/clients-sortable.directive";
import {Elements} from "../../../../shared/models/elements.model";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {DecimalPipe} from "@angular/common";
import {debounceTime, delay, switchMap, tap} from "rxjs/operators";
import {SlabPanelProperties} from "../../../../shared/models/slab-panel-properties.model";


interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

/**
 * Sort the table data
 * @param data Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(data: SlabPanelProperties[], column: string, direction: string): SlabPanelProperties[] {
  if (direction === '') {
    return data;
  } else {
    return [...data].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Table Data Match with Search input
 * @param data Table field value fetch
 * @param term Search the value
 */
function matches(data: SlabPanelProperties, term: string, pipe: PipeTransform) {
  return data.id?.toString().toLowerCase().includes(term)
    || data.name?.toLowerCase().includes(term)
    || data.project?.toString().toLowerCase().includes(term)
    || data.panel_support.name?.toString().toLowerCase().includes(term)
    || data.property.name?.toString().toLowerCase().includes(term)
    || data.name?.toString().toLowerCase().includes(term)
    || data.long_length?.toString().toLowerCase().includes(term)
    || data.short_length?.toString().toLowerCase().includes(term)
    || data.thickness?.toString().toLowerCase().includes(term)
    || data.created_at?.toString().toLowerCase().includes(term);
}
@Injectable({
  providedIn: 'root'
})
export class SpPropertiesService {

  // tslint:disable-next-line: variable-name
  private _loading$ = new BehaviorSubject<boolean>(true);
  // tslint:disable-next-line: variable-name
  private _search$ = new Subject<void>();
  // tslint:disable-next-line: variable-name
  private _activities$ = new BehaviorSubject<SlabPanelProperties[]>([]);
  // tslint:disable-next-line: variable-name
  private _total$ = new BehaviorSubject<number>(0);

  // tslint:disable-next-line: variable-name
  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 1,
    endIndex: 10,
    totalRecords: 0
  };
  // activitiesData: Activities[] = [];
  responceData: SlabPanelProperties[] = [];

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._activities$.next(result.activities);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  /**
   * Returns the value
   */
  get activities$() { return this._activities$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get startIndex() { return this._state.startIndex; }
  get endIndex() { return this._state.endIndex; }
  get totalRecords() { return this._state.totalRecords; }

  /**
   * set the value
   */
  // tslint:disable-next-line: adjacent-overload-signatures
  set page(page: number) { this._set({ page }); }
  // tslint:disable-next-line: adjacent-overload-signatures
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  // tslint:disable-next-line: adjacent-overload-signatures
  // tslint:disable-next-line: adjacent-overload-signatures
  set startIndex(startIndex: number) { this._set({ startIndex }); }
  // tslint:disable-next-line: adjacent-overload-signatures
  set endIndex(endIndex: number) { this._set({ endIndex }); }
  // tslint:disable-next-line: adjacent-overload-signatures
  set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
  // tslint:disable-next-line: adjacent-overload-signatures
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search Method
   */
  private _search(): Observable<{ total: number; activities: SlabPanelProperties[] }> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    // let activities = sort(this.activitiesData, sortColumn, sortDirection);
    let activities = sort(this.responceData, sortColumn, sortDirection);

    // 2. filter
    activities = activities.filter(table => matches(table, searchTerm, this.pipe));
    const total = activities.length;

    // 3. paginate
    this.totalRecords = activities.length;
    this._state.startIndex = (page - 1) * this.pageSize;
    this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
    if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
    }
    activities = activities.slice(this._state.startIndex, this._state.endIndex);

    return of(
      { activities, total }
    );
  }
}
