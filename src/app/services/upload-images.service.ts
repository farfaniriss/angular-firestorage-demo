import { Injectable } from '@angular/core';

import { FileItem } from '../models/file-item';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadImagesService {

  private IMAGE_FOLDER = 'img';

  constructor(private db: AngularFirestore, 
              private storage: AngularFireStorage) { }

  public uploadImageFirebase(images: FileItem[] ) {
    
    for (const item of images) {

      item.isUploading = true;
      if (item.progress >= 100) {
        continue;
      }

      const filePath = `${ this.IMAGE_FOLDER }/${item.fileName}`;
      const file = item.file;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // observe percentage changes
      task.percentageChanges()
        .subscribe( percent => {
          item.progress = percent;
        });

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL()
          .subscribe( result => {
            item.url = result;
            item.isUploading = false;
            this.saveImage({
              name: item.fileName,
              url: item.url
            });
        }))
      )
      .subscribe();
    }
  }

  private saveImage(image: { name: string, url: string}) {
    this.db.collection(`/${ this.IMAGE_FOLDER }`)
      .add(image);
  }
}
