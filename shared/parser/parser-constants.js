/* Parser for Software City: a structural survey of many languages.
   Public API: analyzeProject(entries), analyzeFile(path, src), resolveRef, EXT, EXT_NAME.

   Strategy: regex + brace/indent scanning. We extract, in order:
     - imports / requires
     - classes (with extends, implements, fields, methods, abstract members)
     - functions / methods (with parent, receiver, args, body, complexity)
     - variables (file-level, class-level, function-local reads/writes)
     - calls (receiver-resolved as much as the source allows)
     - data flow (which function reads/writes which variable)
     - relations (extends, implements, has, uses)

   The accuracy caveats are real and the parser is honest about them; see
   the README and the per-test comments for what each regex does and does not
   cover. The aim is to be useful on real code without false confidence. */

export const EXT = {
  js: 'js', mjs: 'js', cjs: 'js', jsx: 'js', ts: 'js', tsx: 'js', mts: 'js', cts: 'js',
  vue: 'html', svelte: 'html', html: 'html', htm: 'html', liquid: 'html', astro: 'html',
  java: 'c', cs: 'c', c: 'c', h: 'c', cpp: 'c', cc: 'c', cxx: 'c', hpp: 'c', hh: 'c', dart: 'c',
  kt: 'kt', kts: 'kt', scala: 'kt', swift: 'swift', go: 'go', rs: 'rs', php: 'php',
  py: 'py', gd: 'gd', rb: 'rb', lua: 'lua', css: 'css', scss: 'css', less: 'css',
  json: 'data', yml: 'data', yaml: 'data', toml: 'data', xml: 'data', tscn: 'data', tres: 'data', godot: 'data',
  md: 'doc', txt: 'doc', sql: 'sql', sh: 'sh', bash: 'sh'
};

export const EXT_NAME = {
  ts: 'TypeScript', tsx: 'TSX', mts: 'TypeScript', cts: 'TypeScript', js: 'JavaScript', jsx: 'JSX', mjs: 'JavaScript', cjs: 'JavaScript',
  vue: 'Vue', svelte: 'Svelte', astro: 'Astro', html: 'HTML', htm: 'HTML', liquid: 'Liquid',
  java: 'Java', cs: 'C#', c: 'C', h: 'C header', cpp: 'C++', cc: 'C++', cxx: 'C++', hpp: 'C++ header', hh: 'C++ header',
  kt: 'Kotlin', kts: 'Kotlin', swift: 'Swift', dart: 'Dart', scala: 'Scala',
  go: 'Go', rs: 'Rust', php: 'PHP', py: 'Python', gd: 'GDScript', rb: 'Ruby', lua: 'Lua',
  css: 'CSS', scss: 'SCSS', less: 'Less',
  json: 'JSON', yml: 'YAML', yaml: 'YAML', toml: 'TOML', xml: 'XML', tscn: 'Godot scene', tres: 'Godot resource', godot: 'Godot project',
  md: 'Markdown', txt: 'Text', sql: 'SQL', sh: 'Shell', bash: 'Shell'
};

export const FAMILY = {
  js: 'brace', c: 'brace', kt: 'brace', swift: 'brace', go: 'brace', rs: 'brace', php: 'brace',
  css: 'css', py: 'indent', gd: 'indent', rb: 'indent', lua: 'indent', sh: 'hash'
};

export const KW = new Set(
  ('if for while switch catch function return with else do try typeof new await sizeof elif foreach using lock fixed unless until loop match yield delete void throw case default in of instanceof super this import export from require assert print defer go select when not and or lambda elsif rescue ensure is as constructor init self trait enum val var let const static public private protected internal override abstract final sealed open module namespace struct union extern mut volatile readonly explicit interface record class object extends implements with where having from select distinct group by order limit offset into values insert update delete create table view index trigger function procedure return as then begin end do case when then else elsif loop exit when').split(' ')
);

export const NAME_BAD = new Set(
  'if for while switch catch function return else do try typeof new await sizeof foreach using lock fixed throw case default instanceof super this import export require yield elif unless until loop lambda synchronized val var let const'.split(' ')
);

export const STMT_START = /^\s*(?:return|new|throw|else|case|await|yield|delete|go|defer|print|echo|assert|typeof|sizeof)\b/;
export const CALL_SKIP = new Set(
  ('if for while switch catch function return with typeof new await sizeof elif foreach using lock fixed unless until loop match yield delete void throw case in of instanceof super import require assert print defer go select when not and or lambda elsif rescue ensure is as').split(' ')
);

export const TYPE_SKIP = new Set(
  'String Number Boolean Object Array Map Set Promise Error Date Math JSON Record Partial Readonly Function Symbol int float double bool void string list dict tuple str any unknown never Vec Option Result Box Self List Dict Optional Any Callable Iterable Iterator Exception ABC object Node Node2D Node3D Resource RefCounted Object Vector2 Vector3 Color Array Dictionary int8 int16 int32 int64 uint8 uint16 uint32 uint64 float32 float64 byte rune complex string byte bool error i8 i16 i32 i64 u8 u16 u32 u64 usize isize f32 f64 str char char8 Self Type Var'.split(' ')
);
