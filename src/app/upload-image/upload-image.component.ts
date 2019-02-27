import { Component, OnInit, Output } from '@angular/core';
import { analyzeFile, ConditionalExpr } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
imageUrl: string = "/assets/img/upload.png"
imageList: string[] = []
fileToPreview: File;

fileToUpload: File;

filesToUploadList: File[] = [];
outputList: string[] = new Array(100)
progressBarDisplayList: boolean[] = new Array(100)

  constructor(private http: HttpClient) { 
   
  }

  ngOnInit() {
  }

  handleFileInput(file: FileList) {
    this.fileToPreview = file.item(0)
    this.fileToUpload = file.item(0)


    //show image preview
    var reader = new FileReader()
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result;
    } 
    reader.readAsDataURL(this.fileToPreview)
    this.fileToPreview = file.item(0)

    console.log(this.fileToPreview)
  }

  onSubmit(file: File) {
    if(this.imageUrl != "/assets/img/upload.png"){
      this.imageList.push(this.imageUrl) 
      this.filesToUploadList.push(this.fileToUpload)
      this.imageUrl = "/assets/img/upload.png"

    }


    console.log(this.filesToUploadList)
  }

  onCancel() {
    this.imageUrl = "/assets/img/upload.png"
    this.fileToUpload = null
  }


  runAllAnalysis() {
    const uploadData = new FormData();

    for(let i = 0; i < this.filesToUploadList.length; i++){
      uploadData.append('imagefile', this.filesToUploadList[i], this.filesToUploadList[i].name);
    this.http.post('http://127.0.0.1:5000/handwritting', uploadData)
    .subscribe(imageRecText => {
      this.outputList[i] = imageRecText.text
      console.log(this.outputList)
    })
    }
    
  }

  runAnalysis(index: number) {
    this.outputList[index] = ""
    this.progressBarDisplayList[index] = true
    const uploadData = new FormData();
    uploadData.append('imagefile', this.filesToUploadList[index], this.filesToUploadList[index].name);
    this.http.post('http://127.0.0.1:5000/handwritting', uploadData)
    .subscribe(result => {
      this.outputList[index] = result.text
      console.log(this.outputList)
      this.progressBarDisplayList[index] = false
    })
    // console.log(index)
  }

}
