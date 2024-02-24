import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ImageCropperModule, ImageTransform } from 'ngx-image-cropper';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-user-icon-dialog',
  standalone: true,
  imports: [ImageCropperModule, FormsModule, MatInputModule, SpinnerComponent, MatProgressSpinnerModule],
  templateUrl: './edit-user-icon-dialog.component.html',
  styleUrl: './edit-user-icon-dialog.component.scss'
})
export class EditUserIconDialogComponent {

  public imageChangedEvent: any = '';
  public isSpinner: boolean = false
  public croppedImage: any = '';
  public scale = 20;
  public imageSelected = false
  public displayImageCropper = false;
  public transform: ImageTransform = {
    translateUnit: 'px'
  };

  constructor(
    private imageCompress: NgxImageCompressService,
    private dialogRef: MatDialogRef<EditUserIconDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  updateUserImage() {
    this.dialogRef.close(this.croppedImage);
  }

  deleteUserIcon() {
    this.croppedImage = 'deleteIcon'
    this.dialogRef.close(this.croppedImage);
  }

  fileChangeEvent(event: any): void {
    console.log('in fileChangeEvent');

    this.isSpinner = true
    this.imageSelected = true
    this.imageChangedEvent = event;
  }

  imageCropped(event: any) {
    this.imageCompress
      .compressFile(event.objectUrl, -1, 25, 25)
      .then((result: DataUrl) => {
        this.croppedImage = result
      });
  }

  imageLoaded() {
    this.displayImageCropper = true
    this.isSpinner = false
  }

  loadImageFailed() {
    this.isSpinner = false
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
