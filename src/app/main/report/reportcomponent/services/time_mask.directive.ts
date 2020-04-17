import {
    BACKSPACE,
    DELETE,
    LEFT_ARROW,
    NINE,
    NUMPAD_NINE,
    NUMPAD_ZERO,
    RIGHT_ARROW,
    UP_ARROW,
    DOWN_ARROW,
    TAB,
    ZERO,
  } from '@angular/cdk/keycodes';
  import {
    Directive,
    ElementRef,
    forwardRef,
    Host,
    HostListener,
    OnInit,
    Renderer2,
    Self,
  } from '@angular/core';
  import {
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    Validator,
  } from '@angular/forms';
  
  @Directive({
    selector: '[appTimeMask]',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TimeMaskDirective),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TimeMaskDirective),
        multi: true,
      },
    ],
  })
  export class TimeMaskDirective implements OnInit, ControlValueAccessor, Validator {
    /** implements ControlValueAccessorInterface */
    _onChange: (_: Date) => void;
  
    /** implements ControlValueAccessorInterface */
    _touched: () => void;
  
    private _dateValue: Date;
  
    /**
     * Esta variável indica que o campo (horas ou minutos) deve se comportar como
     * se tivesse acabado de receber o foco
     */
    private _fieldJustGotFocus = false;
  
    constructor(@Self() private _el: ElementRef, private _renderer: Renderer2) { }
  
    ngOnInit() {
      this._el.nativeElement.style.fontFamily = 'monospace';
      this._el.nativeElement.style.cursor = 'default';
    }
  
    /** Trata as teclas */
    @HostListener('keydown', ['$event'])
    onKeyDown(evt: KeyboardEvent) {
  
      const keyCode = evt.keyCode;
      switch (keyCode) {
        case LEFT_ARROW:
        case RIGHT_ARROW:
        case TAB:
          this._decideWhetherToJumpAndSelect(keyCode, evt);
          break;

        case UP_ARROW:
        case DOWN_ARROW:
            this._timeNumberUpDown(keyCode, evt);
  
        case DELETE:
        case BACKSPACE:
          this._clearHoursOrMinutes();
          break;
  
        default:
          if ((keyCode >= ZERO && keyCode <= NINE) ||
            (keyCode >= NUMPAD_ZERO && keyCode <= NUMPAD_NINE)) {
            // trata números
            this._setInputText(evt.key);
          }
      }
  
      // evita que o componente tente se atualizar:
      // 1 - Quando o usuário digita um número, isso causaria uma piscada na tela: uma vez porque
      //     estamos trocando o valor do componente e outra vez como resposta padrão à digitação
      //     do usuário
      // 2 - Quando o usuário digitar uma tecla diferente das tratadas acima, ela deve ser ignorada
      if (keyCode !== TAB) {
        evt.preventDefault();
      }
    }
  
    /** Quando o componente recebe um click, é preciso selecionar horas ou minutos */
    @HostListener('click', ['$event'])
    onClick(evt: MouseEvent) {
      this._fieldJustGotFocus = true;
      const caretPosition = this._doGetCaretPosition();
      if (caretPosition < 3) {
        this._el.nativeElement.setSelectionRange(0, 2);
      } else {
        this._el.nativeElement.setSelectionRange(3, 6);
      }
    }
  
    /** Quando o componente recebe o foco, é preciso selecionar horas ou minutos */
    @HostListener('focus', ['$event'])
    onFocus(evt: any) {
      this._fieldJustGotFocus = true;
      const caretPosition = this._doGetCaretPosition();
      if (caretPosition < 3) {
        this._el.nativeElement.setSelectionRange(0, 2);
      } else {
        this._el.nativeElement.setSelectionRange(3, 6);
      }
    }
  
    /** Quando o componente perde o foco, dispara o touched do ControlValueAccessor */
    @HostListener('blur', ['$event'])
    onBlur(evt: any) {
      this._touched();
    }
  
    /**
     * Método chamado quando o usuário clica na seta direita ou esquerda
     * Quando o usuário navega com as setas, algumas ações precisam ser tomadas
     * para selecionar o campo certo: horas ou minutos
     */
    private _decideWhetherToJumpAndSelect(keyCode: number, evt?: KeyboardEvent) {
  
      const caretPosition = this._doGetCaretPosition();
  
      switch (keyCode) {
        case RIGHT_ARROW:
          this._el.nativeElement.setSelectionRange(3, 6);
          break;
  
        case LEFT_ARROW:
          this._el.nativeElement.setSelectionRange(0, 2);
          break;
  
        case TAB:
          if (caretPosition < 2 && !evt.shiftKey) {
            this._el.nativeElement.setSelectionRange(3, 6);
            evt.preventDefault();
          } else if (caretPosition > 2 && evt.shiftKey) {
            this._el.nativeElement.setSelectionRange(0, 2);
            evt.preventDefault();
          }
      }
  
      this._fieldJustGotFocus = true;
    }

    private _timeNumberUpDown(keyCode: number, evt?: KeyboardEvent) {
        console.log(keyCode, "event: ", evt);
    }
  
    /**
     * Método chamado quando o usuário digita uma tecla numérica
     */
    private _setInputText(key: string) {
      const input: string[] = this._el.nativeElement.value.split(':');
  
      const hours: string = input[0];
      const minutes: string = input[1];
  
      const caretPosition = this._doGetCaretPosition();
      if (caretPosition < 3) {
        this._setHours(hours, minutes, key);
      } else {
        this._setMinutes(hours, minutes, key);
      }
  
      this._fieldJustGotFocus = false;
    }
  
    /** Ajusta o campo das horas */
    private _setHours(hours: string, minutes: string, key) {
      const hoursArray: string[] = hours.split('');
      const firstDigit: string = hoursArray[0];
      const secondDigit: string = hoursArray[1];
  
      let newHour = '';
  
      let completeTime = '';
      let sendCaretToMinutes = false;
  
      if (firstDigit === '-' || this._fieldJustGotFocus) {
        newHour = `0${key}`;
        // sendCaretToMinutes = Number(key) > 2;
      } else {
        newHour = `${secondDigit}${key}`;
        // if (Number(newHour) > 23) {
        //   newHour = '23';
        // }
        sendCaretToMinutes = true;
      }
  
      completeTime = `${newHour}:${minutes}`;
  
      this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
      this._controlValueChanged();
      if (!sendCaretToMinutes) {
        this._el.nativeElement.setSelectionRange(0, 2);
      } else {
        this._el.nativeElement.setSelectionRange(3, 6);
        this._fieldJustGotFocus = true;
      }
    }
  
    /** Ajusta o campo dos minutos */
    private _setMinutes(hours: string, minutes: string, key) {
      const minutesArray: string[] = minutes.split('');
      const firstDigit: string = minutesArray[0];
      const secondDigit: string = minutesArray[1];
  
      let newMinutes = '';
  
      let completeTime = '';
  
      if (firstDigit === '-' || this._fieldJustGotFocus) {
        newMinutes = `0${key}`;
      } else {
        if (Number(minutes) === 59) {
          newMinutes = `0${key}`;
        } else {
          newMinutes = `${secondDigit}${key}`;
          if (Number(newMinutes) > 59) {
            newMinutes = '59';
          }
        }
      }
  
      completeTime = `${hours}:${newMinutes}`;
  
      this._renderer.setProperty(this._el.nativeElement, 'value', completeTime);
      this._controlValueChanged();
      this._el.nativeElement.setSelectionRange(3, 6);
    }
  
    /** Trata o evento de backspace ou tecla delete */
    _clearHoursOrMinutes() {
      const caretPosition = this._doGetCaretPosition();
      const input: string[] = this._el.nativeElement.value.split(':');
  
      const hours: string = input[0];
      const minutes: string = input[1];
  
      let newTime = '';
      let sendCaretToMinutes = false;
  
      if (caretPosition > 2) {
        newTime = `${hours}:--`;
        sendCaretToMinutes = true;
      } else {
        newTime = `--:${minutes}`;
        sendCaretToMinutes = false;
      }
  
      this._fieldJustGotFocus = true;
  
      this._renderer.setProperty(this._el.nativeElement, 'value', newTime);
      this._controlValueChanged();
      if (!sendCaretToMinutes) {
        this._el.nativeElement.setSelectionRange(0, 2);
      } else {
        this._el.nativeElement.setSelectionRange(3, 6);
      }
    }
  
    /** Implementation for ControlValueAccessor interface */
    writeValue(value: Date): void {
      if (value && !(value instanceof Date)) {
        throw new Error('A diretiva appTimeMask exige que o valor do componente seja do tipo Date');
      }
  
      this._dateValue = new Date(value);
  
      const v = value ? this._dateToStringTime(value) : '--:--';
  
      this._renderer.setProperty(this._el.nativeElement, 'value', v);
    }
  
    /** Implementation for ControlValueAccessor interface */
    registerOnChange(fn: (_: Date) => void): void {
      this._onChange = fn;
    }
  
    /** Implementation for ControlValueAccessor interface */
    registerOnTouched(fn: () => void): void {
      this._touched = fn;
    }
  
    /** Implementation for ControlValueAccessor interface */
    setDisabledState(isDisabled: boolean): void {
      this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
    }
  
    validate(c: FormControl): { [key: string]: any } {
      return this._el.nativeElement.value.indexOf('-') === -1 ? null : { validTime: false };
    }
  
    /*
    ** Returns the caret (cursor) position of the specified text field.
    ** Return value range is 0-nativeElement.value.length.
    */
    private _doGetCaretPosition(): number {
  
      // Initialize
      let iCaretPos = 0;
  
      const nativeElement = this._el.nativeElement;
  
      // IE Support
      if (document.hasOwnProperty('selection')) {
  
        // Set focus on the element
        nativeElement.focus();
  
        // To get cursor position, get empty selection range
        const oSel = document['selection'].createRange();
  
        // Move selection start to 0 position
        oSel.moveStart('character', -nativeElement.value.length);
  
        // The caret position is selection length
        iCaretPos = oSel.text.length;
      } else if (nativeElement.selectionStart || nativeElement.selectionStart === '0') {
        // Firefox support
        iCaretPos = nativeElement.selectionStart;
      }
  
      // Return results
      return iCaretPos;
    }
  
    /** build 2-character string */
    private _zeroFill(value: number): string {
      return (value > 9 ? '' : '0') + value;
    }
  
    /** build a time in 00:00 format */
    private _dateToStringTime(value: Date) {
      return this._zeroFill(value.getHours()) + ':' + this._zeroFill(value.getMinutes());
    }
  
    /** Turns a string in format --, -X, X-, XY into a number, considering '-' => 0 */
    private _stringToNumber(str: string) {
      if (str.indexOf('-') === -1) {
        return Number(str);
      }
  
      const finalStr = str.replace('-', '0').replace('-', '0');
  
      return Number(finalStr);
    }
  
    /** Set the NgControl and local value  */
    private _controlValueChanged() {
      const timeArray: string[] = this._el.nativeElement.value.split(':');
      this._dateValue = new Date(this._dateValue.setHours(this._stringToNumber(timeArray[0])));
      this._dateValue = new Date(this._dateValue.setMinutes(this._stringToNumber(timeArray[1])));
      this._onChange(this._dateValue);
    }
  
  }
  