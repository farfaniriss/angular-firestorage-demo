import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() files: FileItem[] = [];
  @Output() mouseOver : EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseOver.emit(true);
    this._preventAndStop(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseOver.emit(false);
  }
  
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transfer = this._getTransfer(event);

    if (!transfer) return;

    this._getFiles(transfer.files);
    this._preventAndStop(event);
    this.mouseOver.emit(false);
  }

  //Functions
  private _getTransfer( event : any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _getFiles(fileList : FileList) {
    console.log(fileList);

    for (const property in Object.getOwnPropertyNames(fileList)) {
      const tempFile = fileList[property];

      if (this._fileCanBeLoaded(tempFile)) {
        const newFile = new FileItem(tempFile);
        this.files.push(newFile);
      }      
    }

    console.log(this.files);
  }

  //Validations
  private _preventAndStop( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _fileIsDropped( filename: string) : boolean {
    for ( const file of this.files ) {
      if (file.fileName == filename) {
        console.log('file ' + filename + 'is already added.')
        return true;
      }      
    }

    return false;
  }

  private _isImage( fileType: string) : boolean {
    return (fileType === '' || fileType === undefined) ? false : fileType.startsWith('image');
  }

  private _fileCanBeLoaded( file: File) : boolean {
    if (!this._fileIsDropped(file.name) && this._isImage(file.type)) {
      return true;
    }
    else 
    {
      return false;
    }
  }

}
