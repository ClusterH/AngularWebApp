import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GridsterConfig, GridsterItem, } from 'angular-gridster2';
import { GridsterComponent, IGridsterOptions, IGridsterDraggableOptions } from 'angular2gridster';
import { LayoutService, IComponent } from 'app/main/home/analytics/services/layout.service';
import { ClipsService } from 'app/main/home/analytics/services/clips.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;

    @Input() isEditClips: any = {};
    @Input() widgets: Array<any> = [];

    @Output() editedDashboard = new EventEmitter();
    @Output() deleteWidgetId = new EventEmitter();

    get options(): GridsterConfig {
        return this.layoutService.options;
    }
    get layout(): GridsterItem[] {
        return this.layoutService.layout;
    }
    get components(): IComponent[] {
        return this.layoutService.components;
    }

    static X_PROPERTY_MAP: any = {
        sm: 'xSm',
        md: 'xMd',
        lg: 'xLg',
        xl: 'xXl'
    };

    static Y_PROPERTY_MAP: any = {
        sm: 'ySm',
        md: 'yMd',
        lg: 'yLg',
        xl: 'yXl'
    };

    static W_PROPERTY_MAP: any = {
        sm: 'wSm',
        md: 'wMd',
        lg: 'wLg',
        xl: 'wXl'
    };

    static H_PROPERTY_MAP: any = {
        sm: 'hSm',
        md: 'hMd',
        lg: 'hLg',
        xl: 'hXl'
    };

    @ViewChildren(GridsterComponent) gridster: GridsterComponent;
    itemOptions = {
        maxWidth: 52,
        maxHeight: 52
    };
    gridsterOptions: IGridsterOptions = {
        // core configuration is default one - for smallest view. It has hidden minWidth: 0.
        lanes: 52, // amount of lanes (cells) in the grid
        direction: 'vertical', // floating top - vertical, left - horizontal
        floating: false,
        dragAndDrop: true, // enable/disable drag and drop for all items in grid
        resizable: true, // enable/disable resizing by drag and drop for all items in grid
        resizeHandles: {
            s: true,
            e: true,
            se: true,
        },
        widthHeightRatio: 1, // proportion between item width and height
        lines: {
            visible: true,
            color: '#afafaf',
            width: 1
        },
        shrink: true,
        useCSSTransforms: true,
        responsiveView: true, // turn on adopting items sizes on window resize and enable responsiveOptions
        responsiveDebounce: 500, // window resize debounce time
        responsiveSizes: true,
        responsiveToParent: true,
        // List of different gridster configurations for different breakpoints.
        // Each breakpoint is defined by name stored in "breakpoint" property. There is fixed set of breakpoints
        // available to use with default minWidth assign to each.
        // - sm: 576 - Small devices
        // - md: 768 - Medium devices
        // - lg: 992 - Large devices
        // - xl: 1200 - Extra large
        // MinWidth for each breakpoint can be overwritten like it's visible below.
        // ResponsiveOptions can overwrite default configuration with any option available.
        responsiveOptions: [
            {
                breakpoint: 'sm',
                // minWidth: 480,
                lanes: 52
            },
            {
                breakpoint: 'md',
                minWidth: 768,
                lanes: 52
            },
            {
                breakpoint: 'lg',
                minWidth: 1250,
                lanes: 52
            },
            {
                breakpoint: 'xl',
                minWidth: 1800,
                lanes: 52
            }
        ]
    };
    gridsterDraggableOptions: IGridsterDraggableOptions = {
        handlerClass: 'panel-heading'
    };
    widgetsCopy = [];

    constructor(
        public layoutService: LayoutService,
        public clipSservice: ClipsService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.widgetsCopy = this.widgets.map(widget => ({ ...widget }));
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setWidth(widget: any, size: number, e: MouseEvent, gridster) {
        e.stopPropagation();
        e.preventDefault();
        const breakpoint = gridster.options.breakpoint;
        let newWidth = widget[LayoutComponent.W_PROPERTY_MAP[breakpoint] || 'w'] + size;
        if (newWidth < 1) {
            newWidth = 1;
        }
        widget[LayoutComponent.W_PROPERTY_MAP[breakpoint] || 'w'] = newWidth;
        gridster.reload();
        return false;
    }

    setHeight(widget: any, size: number, e: MouseEvent, gridster) {
        e.stopPropagation();
        e.preventDefault();
        const breakpoint = gridster.options.breakpoint;
        let newHeight = widget[LayoutComponent.H_PROPERTY_MAP[breakpoint] || 'h'] + size;
        if (newHeight < 1) {
            newHeight = 1;
        }
        widget[LayoutComponent.H_PROPERTY_MAP[breakpoint] || 'h'] = newHeight;
        gridster.reload();
        return false;
    }
    remove($event, index: number, widget: any) {
        $event.preventDefault();
        this.widgets.splice(index, 1);
        this.deleteWidgetId.emit(widget);
    }

    itemChange($event: any, gridster) {

    }

    resetWidgets() {
        this.widgets = this.widgetsCopy.map(widget => ({ ...widget }));
    }

    trackByFn(index) {
        return index;
    }
}