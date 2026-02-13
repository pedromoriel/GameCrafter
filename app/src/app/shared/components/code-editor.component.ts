import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy {
  @Input() initialCode = '';
  @Input() language = 'javascript';
  @Input() theme = 'vs-dark';
  @Output() codeChanged = new EventEmitter<string>();
  @Output() codeRun = new EventEmitter<string>();
  @Output() codeSaved = new EventEmitter<string>();

  @ViewChild('editorContainer') editorContainer!: ElementRef;
  private editor: any = null;

  async ngAfterViewInit(): Promise<void> {
    await this.initializeEditor();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }

  private async initializeEditor(): Promise<void> {
    try {
      // Wait for Monaco to be loaded from CDN
      const monacoReady = (globalThis as any).monacoReady;
      if (!monacoReady) {
        return;
      }

      const monaco = await monacoReady;
      if (!monaco || !monaco.editor) {
        return;
      }

      // Crear el editor de Monaco
      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.initialCode,
        language: this.language,
        theme: this.theme,
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true
      });

      // Escuchar cambios en el código
      if (this.editor) {
        this.editor.onDidChangeModelContent(() => {
          const code = this.editor?.getValue() || '';
          this.codeChanged.emit(code);
        });
      }
    } catch (error) {
      // Handle initialization error silently
    }
  }

  onSave(): void {
    const code = this.editor?.getValue() || '';
    this.codeSaved.emit(code);
  }

  onRun(): void {
    const code = this.editor?.getValue() || '';
    this.codeRun.emit(code);
  }

  onClear(): void {
    if (this.editor && confirm('Are you sure you want to clear the code?')) {
      this.editor.setValue('');
    }
  }

  setCode(code: string): void {
    if (this.editor) {
      this.editor.setValue(code);
    }
  }

  getCode(): string {
    return this.editor?.getValue() || '';
  }

  async setLanguage(language: string): Promise<void> {
    if (this.editor) {
      try {
        const monacoReady = (globalThis as any).monacoReady;
        if (monacoReady) {
          const monaco = await monacoReady;
          monaco.editor.setModelLanguage(this.editor.getModel()!, language);
        }
      } catch (error) {
        // Handle language change error silently
      }
    }
  }
}
