import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCropperModule, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-user-icon-dialog',
  standalone: true,
  imports: [ImageCropperModule, FormsModule, MatInputModule],
  templateUrl: './edit-user-icon-dialog.component.html',
  styleUrl: './edit-user-icon-dialog.component.scss'
})
export class EditUserIconDialogComponent {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  // base64Image: any = '';
  scale = 1;
  imageSelected = false
  showCropper = false;
  displayImageCropper = false;
  transform: ImageTransform = {
    translateUnit: 'px'
  };

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<EditUserIconDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  updateUserImage() {
    this.dialogRef.close(this.croppedImage);
  }

  fileChangeEvent(event: any): void {
    this.imageSelected = true
    this.imageChangedEvent = event;
  }

  imageCropped(event: any) {
    // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    var reader = new FileReader();
    reader.onload = () => {
      const dataUrl: any = reader.result;
      const base64 = dataUrl.split(',')[1];
      this.croppedImage = 'data:image/png;base64, ' + base64;
    };
    reader.readAsDataURL(event.blob);
  }

  imageLoaded() {
    this.displayImageCropper = true
    this.showCropper = true;
  }

  loadImageFailed() {
    console.error('Load image failed');
  }

  resetImage() {
    this.scale = 1;
    this.transform = {
      translateUnit: 'px'
    };
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

}
