import { Component, OnInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Options } from "ng5-slider";


@Component({
  selector: "app-search-parts",
  templateUrl: "./search-parts.component.html",
  styleUrls: ["./search-parts.component.scss"]
})
export class SearchPartsComponent implements OnInit {
  activatedModalRef: NgbModalRef;
  array = [1, 2, 3];
  yearValue: number = 100;
  seriesValue: number = 100;
  priceValue: number = 100;
  highValue: number = 60;
  priceRange: Options = {
    floor: 0,
    ceil: 90000
  };
  seriesRange: Options = {
    floor: 1950,
    ceil: 2020
  };
  yearRange: Options = {
    floor: 1950,
    ceil: 2020
  };

  constructor(public modalService: NgbModal) {}

  ngOnInit() {}
  openModal(modal: any) {
    this.activatedModalRef = this.modalService.open(modal, { size: "sm" });
  }

  dismissModal() {
    this.activatedModalRef.dismiss();
  }
  closeModal() {
    this.activatedModalRef.close();
  }
  close(){
    // console.log("close")
    // document.getElementById("filter").style.marginLeft="-330px"

    
  }
  openFilter(){
    document.getElementById("filter").style.display="block";
  }
  closeFilter(){
    document.getElementById("filter").style.display="none";
  }
}
