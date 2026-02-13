import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface CodeAsset {
  id: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() initialCode = '';
  @Input() language = 'javascript';
  @Input() theme = 'vs-dark';
  @Output() codeChanged = new EventEmitter<string>();
  @Output() codeRun = new EventEmitter<string>();
  @Output() codeSaved = new EventEmitter<string>();
  @Output() languageChanged = new EventEmitter<'javascript' | 'typescript'>();

  @ViewChild('editorContainer') editorContainer!: ElementRef;
  private editor: any = null;
  currentLanguage: 'javascript' | 'typescript' = 'javascript';

  // Code Assets/Snippets
  availableAssets: CodeAsset[] = [
    {
      id: 'spaceship-shoot',
      name: 'Spaceship Shooter',
      description: 'Complete spaceship that shoots projectiles',
      icon: '🚀',
      code: `class SpaceshipShooter {
  constructor(scene, x, y) {
    this.scene = scene;
    this.spaceship = scene.add.rectangle(x, y, 40, 50, 0x00a6ff);
    this.projectiles = scene.physics.add.group();
    
    scene.input.on('pointerdown', () => this.shoot());
  }

  shoot() {
    const projectile = this.scene.add.rectangle(this.spaceship.x, this.spaceship.y - 25, 5, 10, 0xff00ff);
    this.scene.physics.add.existing(projectile);
    projectile.body.setVelocityY(-300);
    this.projectiles.add(projectile);
  }

  update() {
    this.projectiles.children.entries.forEach(p => {
      if (p.y < 0) {
        p.destroy();
      }
    });
  }
}`
    },
    {
      id: 'collision-system',
      name: 'Collision Detection',
      description: 'Basic collision detection between objects',
      icon: '💥',
      code: `// Collision detection between player and enemies
this.physics.add.overlap(player, enemies, (p, e) => {
  console.log('Collision detected!');
  e.destroy();
  player.setTint(0xff6666);
  this.time.delayedCall(200, () => {
    player.clearTint();
  });
});`
    },
    {
      id: 'animation-tween',
      name: 'Smooth Animation',
      description: 'Create a smooth tween animation',
      icon: '✨',
      code: `this.tweens.add({
  targets: sprite,
  x: 400,
  y: 300,
  duration: 1000,
  ease: 'Sine.easeInOut',
  yoyo: true,
  repeat: -1,
  onUpdate: function(tween) {
    console.log('Animation progress: ' + tween.progress);
  }
});`
    },
    {
      id: 'particle-effect',
      name: 'Particle Effect',
      description: 'Create particle emitter effect',
      icon: '✨',
      code: `const particles = this.add.particles(0xffffff);
const emitter = particles.createEmitter({
  speed: { min: -200, max: 200 },
  angle: { min: 240, max: 300 },
  scale: { start: 1, end: 0 },
  lifespan: 600,
  gravityY: 300
});

emitter.emitParticleAt(x, y);`
    },
    {
      id: 'keyboard-input',
      name: 'Keyboard Input Handler',
      description: 'Handle keyboard input events',
      icon: '⌨️',
      code: `const cursors = this.input.keyboard.createCursorKeys();

this.update = () => {
  if (cursors.left.isDown) {
    player.x -= 5;
  } else if (cursors.right.isDown) {
    player.x += 5;
  }
  if (cursors.up.isDown) {
    player.y -= 5;
  } else if (cursors.down.isDown) {
    player.y += 5;
  }
};`
    },
    {
      id: 'score-system',
      name: 'Score System',
      description: 'Simple score tracking and display',
      icon: '📊',
      code: `let score = 0;
const scoreText = this.add.text(16, 16, 'Score: 0', { 
  fontSize: '24px', 
  fill: '#ffffff' 
});

const addScore = (points) => {
  score += points;
  scoreText.setText('Score: ' + score);
};

// Use: addScore(10);`
    },
    {
      id: 'physics-body',
      name: 'Physics Body Setup',
      description: 'Setup physics-enabled game object',
      icon: '⚙️',
      code: `const gameObject = this.add.rectangle(x, y, width, height, color);
this.physics.add.existing(gameObject);
gameObject.body.setBounce(0.6, 0.6);
gameObject.body.setCollideWorldBounds(true);
gameObject.body.setVelocity(100, 20);`
    },
    {
      id: 'camera-follow',
      name: 'Camera Follow',
      description: 'Make camera follow the player',
      icon: '📷',
      code: `this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
this.cameras.main.startFollow(player);
this.cameras.main.setLerp(0.1, 0.1);

// Or with smooth deadzone
this.cameras.main.startFollow(player, true, 0.5, 0.5);`
    }
  ];

  selectedAssetId: string | null = null;
  showAssetDropdown = false;

  ngOnInit(): void {
    this.currentLanguage = this.language as 'javascript' | 'typescript';
  }

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
        formatOnType: true,
        // Autocompletion settings
        suggest: {
          showStatusBar: true,
          maxVisibleSuggestions: 12,
          shareSuggestSelections: true
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false
        },
        quickSuggestionsDelay: 10,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        // Extra features
        codeLens: true,
        folding: true,
        foldingStrategy: 'auto',
        showFoldingControls: 'mouseover',
        linkedEditing: true,
        // IntelliSense
        parameterHints: { enabled: true, cycle: true },
        // Other enhancements
        wordBasedSuggestions: true,
        bracketPairColorization: { enabled: true }
      });

      // Register custom Phaser completion provider
      this.registerPhaserCompletionProvider(monaco);

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

  private registerPhaserCompletionProvider(monaco: any): void {
    const completionProvider = {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Phaser suggestions
        const phaserSuggestions = [
          {
            label: 'this.add.rectangle()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Add a rectangle sprite to the scene',
            insertText: 'this.add.rectangle(${1:x}, ${2:y}, ${3:width}, ${4:height}, ${5:color})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'this.add.text()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Add text to the scene',
            insertText: 'this.add.text(${1:x}, ${2:y}, \'${3:text}\', { fontSize: \'${4:24}px\' })',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'this.input.on()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Add input event listener',
            insertText: 'this.input.on(\'${1:pointerdown}\', () => {\n\t${2:// your code}\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'this.input.keyboard.on()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Add keyboard event listener',
            insertText: 'this.input.keyboard.on(\'${1:keydown}\', (event) => {\n\t${2:// your code}\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'this.tweens.add()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Create a tween animation',
            insertText: 'this.tweens.add({\n\ttargets: ${1:sprite},\n\tduration: ${2:1000},\n\t${3:// animation properties}\n})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'this.physics.add.staticGroup()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Create a static physics group',
            insertText: 'this.physics.add.staticGroup()',
            range: range
          },
          {
            label: 'class MyScene extends Phaser.Scene',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Create a new Phaser scene',
            insertText: 'class ${1:MyScene} extends Phaser.Scene {\n\tconstructor() {\n\t\tsuper({ key: \'${2:MyScene}\' });\n\t}\n\n\tcreate() {\n\t\t${3:// your code}\n\t}\n\n\tupdate() {\n\t\t${4:// your code}\n\t}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          }
        ];

        return { suggestions: phaserSuggestions };
      }
    };

    monaco.languages.registerCompletionItemProvider(['javascript', 'typescript'], completionProvider);
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

  onLanguageChange(): void {
    this.languageChanged.emit(this.currentLanguage);
    this.setLanguage(this.currentLanguage);
  }

  toggleAssetDropdown(): void {
    this.showAssetDropdown = !this.showAssetDropdown;
  }

  insertAssetCode(assetId: string): void {
    const asset = this.availableAssets.find(a => a.id === assetId);
    if (!asset || !this.editor) {
      return;
    }

    // Get current cursor position
    const position = this.editor.getPosition();
    const currentLine = this.editor.getModel().getLineContent(position.lineNumber);
    
    // Determine indentation based on current line
    const indentMatch = currentLine.match(/^\s*/);
    const currentIndent = indentMatch ? indentMatch[0] : '';
    
    // Add proper indentation to the code
    const indentedCode = asset.code
      .split('\n')
      .map((line, index) => index === 0 ? line : currentIndent + line)
      .join('\n');

    // Insert the code with newlines before and after
    const codeToInsert = '\n' + indentedCode + '\n';
    
    // Execute edit at cursor position
    this.editor.executeEdits('asset-insert', [{
      range: new (window as any).monaco.Range(
        position.lineNumber,
        currentLine.length + 1,
        position.lineNumber,
        currentLine.length + 1
      ),
      text: codeToInsert
    }]);

    // Close dropdown and refocus editor
    this.showAssetDropdown = false;
    this.editor.focus();
  }

  getAssetCountText(): number {
    return this.availableAssets.length;
  }
}
