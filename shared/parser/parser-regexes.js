/* Regex library for Software City's parser.
   Each pattern has a short name, the regex, and (in the comments) what it
   matches and what it intentionally does not. The aim is to make a
   regression test read like documentation: a failing test tells you which
   real-world snippet doesn't match. */

export const RX = {
  /* JS / TS function declarations, including exported, default, async, generator. */
  jsFn: /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*[(<]/,

  /* JS arrow functions bound to a name: const foo = (...) => ... */
  jsArrow: /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*(?::[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>|\(\s*$)/,

  /* Class-field arrow function: foo = (...) => ... */
  jsProp: /^\s*(?:(?:public|private|protected|static|readonly)\s+)*([A-Za-z_$#][\w$]*)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]+)?=>/,

  /* Object-literal method shorthand: foo: function() {} or foo: () => ... */
  jsObj: /^\s*([A-Za-z_$][\w$]*)\s*:\s*(?:async\s+)?(?:function\b|\([^)]*\)\s*=>)/,

  /* JS/TS class method with body on the same line. */
  jsMethod: /^\s*(?:(?:public|private|protected|static|async|get|set|override|readonly|abstract)\s+)*\*?\s*(#?[A-Za-z_$][\w$]*)\s*(?:<[^>]*>)?\s*\([^;]*\)\s*(?::\s*[^{;=]+)?\s*\{/,

  /* C / C++ / Java / C# / Kotlin / Swift function definition (very forgiving). */
  cFn: /^\s*(?:@\w+(?:\([^)]*\))?\s+)*(?:[\w:<>\[\],*&?.]+\s+)+\**&?\s*([A-Za-z_~][\w]*)\s*(?:<[^<>()]*(?:<[^<>()]*>[^<>()]*)*>)?\s*\([^;]*\)?\s*(?:const\s*)?(?:override\s*)?(?:noexcept\s*)?(?:throws[\w\s,.]*)?(?:->\s*[\w:<>*&]+\s*)?(?:\{.*|:.*|=>.*)?$/,

  /* Go func. Captures optional receiver type and name. */
  goFn: /^\s*func\s+(?:\(\s*(?:(\w+)\s+)?\*?\s*([A-Za-z_]\w*)(?:\[[^\]]*\])?\s*\)\s*)?([A-Za-z_]\w*)\s*[(\[]/,

  /* Module.exports.x = function... or foo.bar.baz = function... */
  jsAssign: /^\s*((?:[A-Za-z_$][\w$]*\.)+)([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\b[^(]*\(|\([^)]*\)\s*(?::[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>)/,

  /* Function expression: const x = function name() {} */
  jsNamedExpr: /(?:=|\breturn|\(|,|:)\s*(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/,

  /* Method declaration that may span lines (the body is on a later line). */
  jsMethodML: /^\s*(?:(?:public|private|protected|static|async|get|set|override|readonly|abstract)\s+)*\*?\s*(#?[A-Za-z_$][\w$]*)\s*(?:<[^>]*>)?\s*\((?:[^()]|\([^()]*\))*$/,

  /* Go: type Foo struct { ... } / type Foo interface { ... } */
  goType: /^\s*type\s+([A-Za-z_]\w*)(?:\[[^\]]*\])?\s+(struct|interface)\b/,

  /* Go: type Foo SomeOtherType; (a type alias to a primitive). */
  goType2: /^\s*type\s+([A-Za-z_]\w*)(?:\[[^\]]*\])?\s+(?!struct\b|interface\b|=)(\S)/,

  /* Rust fn. */
  rsFn: /^\s*(?:pub(?:\([^)]*\))?\s+)?(?:const\s+)?(?:async\s+)?(?:unsafe\s+)?(?:extern\s+"[^"]*"\s+)?fn\s+([A-Za-z_]\w*)/,

  /* Kotlin / Swift fun. Captures optional receiver and name. */
  ktFn: /^\s*(?:(?:private|public|internal|protected|override|open|suspend|inline|operator|infix|abstract|static|final|mutating|class|@\w+)\s+)*(?:fun|func|def)\s+(?:<[^>]*>\s*)?(?:[\w.]+(?:<[^>]*>)?\??\.)?([A-Za-z_]\w*)/,

  /* Kotlin init block. */
  ktInit: /^\s*(init)\s*(?:\([^)]*\))?\s*\{/,

  /* PHP function. */
  phpFn: /^\s*(?:(?:public|private|protected|static|abstract|final)\s+)*function\s+&?([A-Za-z_]\w*)\s*\(/,

  /* Class declaration: covers class, struct, interface, enum, trait, impl, object, record, protocol, extension, namespace, module, union. */
  cls: /^\s*(?:export\s+)?(?:default\s+)?(?:(?:public|private|internal|protected|abstract|final|sealed|static|partial|data|open|pub(?:\([^)]*\))?|declare|inner|readonly|value|annotation|enum(?=\s+class\b)|record(?=\s+(?:class|struct)\b))\s+)*(class|struct|interface|enum|trait|impl|object|record|protocol|extension|namespace|module|union)\b\s*(?:<[^>]*>\s*)?([A-Za-z_][\w]*)?(?:\s*<[^>]*>)?(?:\s+for\s+([A-Za-z_]\w*))?(.*)$/,

  /* Python class. */
  pyCls: /^(\s*)class\s+([A-Za-z_]\w*)(.*)$/,

  /* Python def. */
  pyFn: /^(\s*)(?:async\s+)?def\s+([A-Za-z_]\w*)/,

  /* GDScript func. */
  gdFn: /^(\s*)(?:static\s+)?func\s+([A-Za-z_]\w*)/,

  /* Ruby def. */
  rbFn: /^(\s*)def\s+(?:self\.)?([\w?!=]+)/,

  /* Ruby class or module. */
  rbCls: /^(\s*)(?:class|module)\s+([A-Z][\w:]*)(.*)$/,

  /* Lua function or named function expression. */
  luaFn: /^(\s*)(?:local\s+)?function\s+([\w.:]+)|^(\s*)(?:local\s+)?([\w.]+)\s*=\s*function\b/
};

/* Cyclomatic complexity counter: every branch keyword or operator adds 1. */
export const CX = /\b(?:if|for|foreach|while|case|catch|except|elif|elsif|when|guard|unless|until|rescue)\b|&&|\|\||\?\?|\band\b|\bor\b/g;

/* Indentation of a line in spaces (tab counts as 4). */
export function ind(s) {
  let n = 0;
  for (const ch of s) {
    if (ch === ' ') n++;
    else if (ch === '\t') n += 4;
    else break;
  }
  return n;
}

/* Last segment of a dotted/::/namespaced path. */
export function lastSeg(s) {
  return s.split(/\.|::|\\/).pop();
}

/* Split a comma-separated list of types, stripping common access modifiers
   and balancing generics up to 4 levels deep. */
export function splitTypes(s) {
  let t = s;
  for (let k = 0; k < 4; k++) t = t.replace(/<[^<>]*>/g, '');
  return t.split(',').map(x => x.replace(/\b(public|private|protected|virtual|internal)\b/g, '').trim())
    .map(x => { const m = /[A-Za-z_][\w.:\\]*(\(\))?/.exec(x); return m ? m[0] : null; })
    .filter(Boolean);
}

/* Split a list on commas that are not nested in (), <>, [] or {}. */
export function splitTop(s) {
  const out = []; let d = 0, cur = '';
  for (const ch of s) {
    if ('(<[{'.includes(ch)) d++;
    else if (')>]}'.includes(ch)) d--;
    if (ch === ',' && d <= 0) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}
