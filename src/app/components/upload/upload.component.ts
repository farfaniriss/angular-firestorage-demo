import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { UploadImagesService } from "../../services/upload-images.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  files: FileItem[] = [];
  isOverDrop = false;

  constructor(public _uploadService: UploadImagesService) { }

  ngOnInit() {
  }

  uploadImage() {
    this._uploadService.uploadImageFirebase(this.files);
  }

  clearFiles() {
    this.files = [];
  }
}
