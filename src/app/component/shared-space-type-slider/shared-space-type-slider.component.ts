import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-space-type-slider',
  templateUrl: './shared-space-type-slider.component.html',
  styleUrls: ['./shared-space-type-slider.component.scss'],
})
export class SharedSpaceTypeSliderComponent implements OnInit {
  @Input() spaces;
  @Output() spaceSelected = new EventEmitter();
  @Output() clearAll = new EventEmitter();

  options = {
    slidesPerView : 4.5,
    spaceBetween: 10,
    slideOffsetBefore: 0
  };
  clearFilter: boolean;
  spaceFilters: any = [];
  constructor() { }

  ngOnInit() {}

  spaceClick(space){
    this.clearFilter = true;
    if (space.status) {
      space.status = false;
      const index: number = this.spaceFilters.indexOf(space._id);
      if (index !== -1) {
        this.spaceFilters.splice(index, 1);
      }
    } else {
      space.status = true;
      this.spaceFilters.push(space._id);
    };
    this.spaceSelected.emit(this.spaceFilters);
  }

  clearFilters(){
    this.spaceFilters = [];
    this.clearAll.emit();
    this.clearFilter = false;
  }

}


