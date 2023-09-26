import { Injectable } from '@angular/core';
import { CustomHttpService } from './custom-http.service';
import { SharedService } from './shared.service';
import { Gallery } from 'app/models/Gallery';
import { FileToUpload } from 'app/models/file-to-upload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _customHttp: CustomHttpService, private _sharedService: SharedService) { }
  
  saveImage(imageDataURL: string){
    var url = 'api/Common/SaveImage';
    return this._customHttp.postWithoutLoader(url, {ImageDataUrl: imageDataURL});
  }

  saveFile(theFile: FileToUpload): Observable<any> {
    var url = 'api/Common/SaveFile';
    return this._customHttp.postWithoutLoader(url, theFile);
  }

  saveGallery(gallery: Array<Gallery>){
    var url = 'api/Common/SaveAllImage';
    return this._customHttp.postWithoutLoader(url, gallery);
  }

  getMetaData() {
    let url ='api/MetaData/GetMetaData';
    return this._customHttp.get(url, {userID : this._sharedService.logged_user_id, userRoleID : this._sharedService.logged_user_role_id, workshopID : this._sharedService.currentWorkshopID});
  }

}
