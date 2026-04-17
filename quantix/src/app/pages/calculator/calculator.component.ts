import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

const UNITS: Record<string, string[]> = {
  Length:      ['Feet', 'Inches', 'Yards', 'Centimeters'],
  Weight:      ['Grams', 'Kilograms', 'Pound'],
  Volume:      ['Litre', 'MilliLitre', 'Gallon'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  activeOp      = 'convert';
  quantityTypes = Object.keys(UNITS);
  errorMsg      = '';

  // CONVERT
  conv = { type: 'Length', value: 0, fromUnit: 'Feet', toUnit: 'Inches' };
  convResult = '';

  // COMPARE
  cmp = { type: 'Length', value1: 0, unit1: 'Feet', value2: 0, unit2: 'Inches' };
  cmpResult = '';
  cmpEqual: boolean | null = null;

  // ADD
  add = { type: 'Length', value1: 0, unit1: 'Feet', value2: 0, unit2: 'Inches' };
  addResult = '';

  // SUBTRACT
  sub = { type: 'Length', value1: 0, unit1: 'Feet', value2: 0, unit2: 'Inches', resultUnit: 'Feet' };
  subResult = '';

  // DIVIDE
  div = { type: 'Length', value1: 0, unit1: 'Feet', value2: 1, unit2: 'Inches' };
  divResult = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  // Get units list for a type
  getUnits(type: string): string[] {
    return UNITS[type] || [];
  }

  // Switch operation tab
  switchOp(op: string): void {
    this.activeOp = op;
    this.errorMsg = '';
  }

  // When quantity type changes, reset unit dropdowns
  onTypeChange(op: string): void {
    this.errorMsg = '';
    if (op === 'conv') {
      const u = this.getUnits(this.conv.type);
      this.conv.fromUnit = u[0]; this.conv.toUnit = u[1] || u[0];
      this.convResult = '';
    }
    if (op === 'cmp') {
      const u = this.getUnits(this.cmp.type);
      this.cmp.unit1 = u[0]; this.cmp.unit2 = u[1] || u[0];
      this.cmpResult = ''; this.cmpEqual = null;
    }
    if (op === 'add') {
      const u = this.getUnits(this.add.type);
      this.add.unit1 = u[0]; this.add.unit2 = u[1] || u[0];
      this.addResult = '';
    }
    if (op === 'sub') {
      const u = this.getUnits(this.sub.type);
      this.sub.unit1 = u[0]; this.sub.unit2 = u[1] || u[0];
      this.sub.resultUnit = u[0]; this.subResult = '';
    }
    if (op === 'div') {
      const u = this.getUnits(this.div.type);
      this.div.unit1 = u[0]; this.div.unit2 = u[1] || u[0];
      this.divResult = '';
    }
  }

  // CONVERT
  doConvert(): void {
    this.api.convert({
      quantityType: this.conv.type,
      value:        this.conv.value,
      sourceUnit:   this.conv.fromUnit,
      targetUnit:   this.conv.toUnit,
    }).subscribe({
      next: (res) => {
        const d = res.data ?? res;
        this.convResult = `${this.round(d.value)} ${d.unitSymbol ?? ''}`;
      },
      error: (err) => this.showError(err)
    });
  }

  // COMPARE
  doCompare(): void {
    this.api.compare({
      quantityType: this.cmp.type,
      value1: this.cmp.value1, unit1: this.cmp.unit1,
      value2: this.cmp.value2, unit2: this.cmp.unit2,
    }).subscribe({
      next: (res) => {
        const d = res.data ?? res;
        this.cmpEqual  = d.areEqual;
        this.cmpResult = d.areEqual ? '✓  Equal' : '✗  Not Equal';
      },
      error: (err) => this.showError(err)
    });
  }

  // ADD
  doAdd(): void {
    this.api.add({
      quantityType: this.add.type,
      value1: this.add.value1, unit1: this.add.unit1,
      value2: this.add.value2, unit2: this.add.unit2,
    }).subscribe({
      next: (res) => {
        const d = res.data ?? res;
        this.addResult = `${this.round(d.value)} ${d.unitSymbol ?? ''}`;
      },
      error: (err) => this.showError(err)
    });
  }

  // SUBTRACT
  doSubtract(): void {
    this.api.subtract({
      quantityType: this.sub.type,
      value1: this.sub.value1, unit1: this.sub.unit1,
      value2: this.sub.value2, unit2: this.sub.unit2,
      resultUnit: this.sub.resultUnit,
    }).subscribe({
      next: (res) => {
        const d = res.data ?? res;
        this.subResult = `${this.round(d.value)} ${d.unitSymbol ?? ''}`;
      },
      error: (err) => this.showError(err)
    });
  }

  // DIVIDE
  doDivide(): void {
    if (this.div.value2 <= 0) { this.errorMsg = 'Divisor cannot be zero'; return; }
    this.api.divide({
      quantityType: this.div.type,
      value1: this.div.value1, unit1: this.div.unit1,
      value2: this.div.value2, unit2: this.div.unit2,
    }).subscribe({
      next: (res) => {
        const d = res.data ?? res;
        this.divResult = `${this.round(d.ratio ?? d.value)}`;
      },
      error: (err) => this.showError(err)
    });
  }

  private round(n: number): number {
    return parseFloat(Number(n).toFixed(6));
  }

  private showError(err: any): void {
    this.errorMsg = err?.error?.message || 'Something went wrong';
  }
}