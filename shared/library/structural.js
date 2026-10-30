// Family: Structural. 7 pattern(s).
// Authored by Theodor Dimitriou. © 2026 Dimitriou eCommerce Web Services UG (haftungsbeschränkt). Dual-licensed under Polyform Noncommercial 1.0.0 + paid commercial licence.

export default {
  "families": [
    "Structural"
  ],
  "patterns": [
    {
      "id": "adapter",
      "name": "Adapter",
      "family": "Structural",
      "aka": [
        "Wrapper",
        "Translator"
      ],
      "tagline": "Wrap an object with the wrong interface so it fits the one your code expects.",
      "intent": "Your code expects one interface, but the class you need to use offers a different one and you cannot (or should not) change it. An adapter implements the expected interface and translates each call into calls on the wrapped object, so old or third-party code plugs in without touching either side.",
      "analogy": "A travel plug adapter: your laptop charger stays the same, the wall socket stays the same, and a small piece in between makes them fit.",
      "cityShape": "Look for a small adapter building standing between two others: the client's call pipe lands on the adapter's floors, and from each of those floors a second pipe continues into the adaptee building. The adapter's frame shows an implements link to the target interface and a has link to the adaptee.",
      "roles": [
        {
          "name": "Target",
          "desc": "The interface the client code was written against."
        },
        {
          "name": "Adaptee",
          "desc": "The existing class with a useful but incompatible interface (legacy code, a library, a platform API)."
        },
        {
          "name": "Adapter",
          "desc": "Implements the Target and forwards each call to the Adaptee, converting arguments and results on the way."
        },
        {
          "name": "Client",
          "desc": "Uses the Target only, so it never learns which adaptee is behind it."
        }
      ],
      "whenToUse": [
        "You must use a library or legacy class whose method names, units or return types do not match your code.",
        "You want to swap one third-party service for another (payment, input, HTTP) without rewriting the callers.",
        "Several platforms do the same job differently and you want one uniform API on top."
      ],
      "pitfalls": [
        "Adapters that grow business logic stop being translators and become a hidden second implementation.",
        "Lossy conversions (units, error codes, rounding) are easy to get subtly wrong; test the adapter itself.",
        "Stacking adapters on adapters is a sign the target interface itself needs rethinking."
      ],
      "related": [
        "facade",
        "decorator",
        "proxy",
        "bridge"
      ],
      "quiz": [
        {
          "q": "What is the main difference between an Adapter and a Decorator?",
          "options": [
            "An adapter changes the interface; a decorator keeps it and adds behaviour",
            "An adapter is faster",
            "A decorator can only wrap one object",
            "There is no difference"
          ],
          "answer": 0,
          "why": "The adapter's job is translation to a different interface. A decorator implements the same interface as what it wraps and layers extra behaviour on top."
        },
        {
          "q": "In the payment demo, which class would change if the shop switched to a new bank SDK?",
          "options": [
            "Checkout",
            "PaymentProcessor",
            "Only the adapter (or a new adapter)",
            "Every class"
          ],
          "answer": 2,
          "why": "Checkout depends only on the PaymentProcessor interface. A new SDK needs a new adapter; the client stays untouched."
        }
      ],
      "demos": [
        {
          "id": "adapter-ts-payments",
          "title": "Old bank SDK in a new shop",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "A shop's checkout speaks PaymentProcessor.pay(customer, cents). An old bank SDK wants an account id and a euro string. The adapter translates both ways, so checkout.ts never imports the bank.",
          "roles": {
            "Target": [
              "adapter-ts-payments/payment-processor.ts#PaymentProcessor"
            ],
            "Adaptee": [
              "adapter-ts-payments/legacy-bank.ts#LegacyBankApi"
            ],
            "Adapter": [
              "adapter-ts-payments/bank-adapter.ts#LegacyBankAdapter"
            ],
            "Client": [
              "adapter-ts-payments/checkout.ts#Checkout",
              "adapter-ts-payments/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "adapter-ts-payments/main.ts#main",
              "say": "main() wraps the old SDK in an adapter once and hands checkout a plain PaymentProcessor."
            },
            {
              "at": "adapter-ts-payments/checkout.ts#Checkout.placeOrder",
              "say": "Checkout calls pay(customer, cents). It has no idea a legacy bank is involved."
            },
            {
              "at": "adapter-ts-payments/bank-adapter.ts#LegacyBankAdapter.pay",
              "say": "The adapter converts cents to a euro string and the customer name to an account id: pure translation."
            },
            {
              "at": "adapter-ts-payments/legacy-bank.ts#LegacyBankApi.sendMoney",
              "say": "The old SDK does the real work in its own format and answers with a status code."
            },
            {
              "at": "adapter-ts-payments/bank-adapter.ts#LegacyBankAdapter.pay",
              "say": "Back in the adapter, code 200 becomes true. The client gets the boolean it was promised."
            }
          ],
          "files": {
            "adapter-ts-payments/bank-adapter.ts": "import { PaymentProcessor } from './payment-processor';\nimport { LegacyBankApi } from './legacy-bank';\n\n// The Adapter: looks like a PaymentProcessor on the outside,\n// talks to the LegacyBankApi on the inside.\nexport class LegacyBankAdapter implements PaymentProcessor {\n  private bank: LegacyBankApi;\n\n  constructor(bank: LegacyBankApi) {\n    this.bank = bank;\n  }\n\n  pay(customer: string, amountCents: number): boolean {\n    const accountId = 'ACC-' + customer.toUpperCase();\n    const euros = (amountCents / 100).toFixed(2);\n    const result = this.bank.sendMoney(accountId, euros);\n    return result.code === 200;\n  }\n}\n",
            "adapter-ts-payments/checkout.ts": "import { PaymentProcessor } from './payment-processor';\n\n// The Client: it only knows the PaymentProcessor interface.\nexport class Checkout {\n  private payments: PaymentProcessor;\n\n  constructor(payments: PaymentProcessor) {\n    this.payments = payments;\n  }\n\n  placeOrder(customer: string, totalCents: number): void {\n    const ok = this.payments.pay(customer, totalCents);\n    console.log(ok ? `Order for ${customer} confirmed` : `Payment for ${customer} declined`);\n  }\n}\n",
            "adapter-ts-payments/legacy-bank.ts": "// The Adaptee: an old bank SDK we cannot change.\n// It wants an account id, a euro amount as text, and answers with a status code.\nexport class LegacyBankApi {\n  sendMoney(accountId: string, euros: string): { code: number } {\n    console.log(`[bank] moving ${euros} EUR from ${accountId}`);\n    return { code: Number(euros) > 500 ? 402 : 200 };\n  }\n}\n",
            "adapter-ts-payments/main.ts": "import { Checkout } from './checkout';\nimport { LegacyBankAdapter } from './bank-adapter';\nimport { LegacyBankApi } from './legacy-bank';\n\nfunction main(): void {\n  // Wrap the old SDK once; the rest of the shop never sees it.\n  const processor = new LegacyBankAdapter(new LegacyBankApi());\n  const checkout = new Checkout(processor);\n\n  checkout.placeOrder('ana', 4999);\n  checkout.placeOrder('ben', 79900);\n}\n\nmain();\n",
            "adapter-ts-payments/payment-processor.ts": "// The Target: the interface our shop code was written against.\nexport interface PaymentProcessor {\n  pay(customer: string, amountCents: number): boolean;\n}\n"
          }
        },
        {
          "id": "adapter-gd-input",
          "title": "Keyboard and touch joystick behind one input API",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "The player reads movement from a MoveInput. On desktop a KeyboardInput wraps Godot's Input; on phones a JoystickAdapter wraps an addon joystick that speaks angle and strength. Notice player.gd never mentions the joystick.",
          "roles": {
            "Target": [
              "adapter-gd-input/move_input.gd#MoveInput"
            ],
            "Adaptee": [
              "adapter-gd-input/virtual_joystick.gd#VirtualJoystick"
            ],
            "Adapter": [
              "adapter-gd-input/joystick_adapter.gd#JoystickAdapter",
              "adapter-gd-input/keyboard_input.gd#KeyboardInput"
            ],
            "Client": [
              "adapter-gd-input/player.gd#Player"
            ]
          },
          "trace": [
            {
              "at": "adapter-gd-input/level.gd#_ready",
              "say": "The level checks for a touchscreen and plugs the matching adapter into player.input. This is the only place that knows both sides."
            },
            {
              "at": "adapter-gd-input/player.gd#_physics_process",
              "say": "Every physics frame the player asks its MoveInput for a vector and a jump flag. Same code on desktop and phone."
            },
            {
              "at": "adapter-gd-input/joystick_adapter.gd#get_move_vector",
              "say": "On touch devices the adapter turns the addon's angle and strength into the Vector2 the player expects."
            },
            {
              "at": "adapter-gd-input/virtual_joystick.gd#get_angle",
              "say": "The adaptee keeps its own API. We never edit addon code, so updating the addon stays painless."
            },
            {
              "at": "adapter-gd-input/joystick_adapter.gd#wants_jump",
              "say": "A rising tap count becomes 'jump just pressed'. Translating events, not just values, is adapter work too."
            },
            {
              "at": "adapter-gd-input/keyboard_input.gd#get_move_vector",
              "say": "On desktop a tiny adapter over Input.get_vector does the same job. Adding a gamepad later means one more small class."
            }
          ],
          "files": {
            "adapter-gd-input/joystick_adapter.gd": "class_name JoystickAdapter\nextends MoveInput\n\n# The Adapter: it IS a MoveInput, and it HAS a VirtualJoystick.\nvar joystick: VirtualJoystick\nvar _last_taps := 0\n\nfunc _init(stick: VirtualJoystick) -> void:\n\tjoystick = stick\n\n# Translate angle + strength into the Vector2 the player expects.\nfunc get_move_vector() -> Vector2:\n\tif joystick.get_strength() < 0.1:\n\t\treturn Vector2.ZERO\n\treturn Vector2.from_angle(joystick.get_angle()) * joystick.get_strength()\n\n# Translate \"tap count went up\" into \"jump was just pressed\".\nfunc wants_jump() -> bool:\n\tvar jumped := joystick.tap_count > _last_taps\n\t_last_taps = joystick.tap_count\n\treturn jumped\n",
            "adapter-gd-input/keyboard_input.gd": "class_name KeyboardInput\nextends MoveInput\n\n# A thin adapter over Godot's own Input singleton and the project's input map.\nfunc get_move_vector() -> Vector2:\n\treturn Input.get_vector(\"move_left\", \"move_right\", \"move_up\", \"move_down\")\n\nfunc wants_jump() -> bool:\n\treturn Input.is_action_just_pressed(\"jump\")\n",
            "adapter-gd-input/level.gd": "extends Node2D\n\n@onready var player: Player = $Player\n@onready var stick: VirtualJoystick = $TouchUI/VirtualJoystick\n\n# Pick the right adapter once. The player script never changes.\nfunc _ready() -> void:\n\tif DisplayServer.is_touchscreen_available():\n\t\tplayer.input = JoystickAdapter.new(stick)\n\telse:\n\t\tplayer.input = KeyboardInput.new()\n\nfunc _on_jump_button_pressed() -> void:\n\tstick.register_tap()\n",
            "adapter-gd-input/move_input.gd": "class_name MoveInput\nextends RefCounted\n\n# The Target: the only input contract the player script knows.\n# GDScript has no interfaces, so a base class with default methods plays that role.\nfunc get_move_vector() -> Vector2:\n\treturn Vector2.ZERO\n\nfunc wants_jump() -> bool:\n\treturn false\n",
            "adapter-gd-input/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The Client: moves with whatever MoveInput it is given.\nconst SPEED := 220.0\nconst JUMP_VELOCITY := -420.0\n\nvar input: MoveInput = KeyboardInput.new()\n\nfunc _physics_process(delta: float) -> void:\n\tvar move := input.get_move_vector()\n\tvelocity.x = move.x * SPEED\n\tif is_on_floor() and input.wants_jump():\n\t\tvelocity.y = JUMP_VELOCITY\n\tvelocity += get_gravity() * delta\n\tmove_and_slide()\n",
            "adapter-gd-input/virtual_joystick.gd": "class_name VirtualJoystick\nextends Control\n\n# The Adaptee: pretend this came from an asset-library addon.\n# It speaks in angle (radians) and strength (0..1), and counts taps instead of\n# offering \"just pressed\". We do not edit addon code; we adapt to it.\nvar angle := 0.0\nvar strength := 0.0\nvar tap_count := 0\n\nfunc _gui_input(event: InputEvent) -> void:\n\tif event is InputEventScreenDrag:\n\t\tvar offset: Vector2 = event.position - size / 2.0\n\t\tangle = offset.angle()\n\t\tstrength = clamp(offset.length() / (size.x / 2.0), 0.0, 1.0)\n\telif event is InputEventScreenTouch and not event.pressed:\n\t\tstrength = 0.0\n\nfunc get_angle() -> float:\n\treturn angle\n\nfunc get_strength() -> float:\n\treturn strength\n\nfunc register_tap() -> void:\n\ttap_count += 1\n"
          }
        },
        {
          "id": "adapter-axios-real",
          "title": "axios: one request shape, many transports",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "axios/axios",
            "url": "https://github.com/axios/axios/blob/v1.7.9/lib/adapters/adapters.js",
            "license": "MIT",
            "note": "lib/adapters/adapters.js, lib/adapters/xhr.js and lib/core/dispatchRequest.js are verbatim from axios v1.7.9 (header comment added). usage.js was written for Software City."
          },
          "story": "axios runs in browsers and Node. Each transport (XMLHttpRequest, Node http, fetch) is wrapped in an adapter with the same shape: (config) => Promise<response>. The core never touches a transport directly.",
          "roles": {
            "Target": [
              "adapter-axios-real/lib/adapters/adapters.js"
            ],
            "Adaptee": [
              "adapter-axios-real/lib/adapters/xhr.js"
            ],
            "Adapter": [
              "adapter-axios-real/lib/adapters/xhr.js#onloadend",
              "adapter-axios-real/usage.js#memoryAdapter"
            ],
            "Client": [
              "adapter-axios-real/lib/core/dispatchRequest.js#dispatchRequest",
              "adapter-axios-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "adapter-axios-real/lib/core/dispatchRequest.js#dispatchRequest",
              "say": "The axios core asks for an adapter, then calls adapter(config).then(...). It only relies on the shared shape, never on XHR or http."
            },
            {
              "at": "adapter-axios-real/lib/adapters/adapters.js#getAdapter",
              "say": "getAdapter walks the preference list. Names map to known adapters; a value of false means 'not supported here', so it moves on."
            },
            {
              "at": "adapter-axios-real/lib/adapters/xhr.js#onloadend",
              "say": "Inside the XHR adapter, status, responseText and raw header text are translated into axios' response object."
            },
            {
              "at": "adapter-axios-real/lib/adapters/xhr.js#done",
              "say": "Cleanup of XHR-specific listeners stays inside the adapter. Callers never see these details."
            },
            {
              "at": "adapter-axios-real/usage.js#run",
              "say": "Our example asks for ['xhr', memoryAdapter]. In Node xhr is false, so the custom adapter is chosen."
            },
            {
              "at": "adapter-axios-real/usage.js#memoryAdapter",
              "say": "A hand-written adapter just honours the same contract and returns a response object, which is why axios is easy to mock in tests."
            }
          ],
          "files": {
            "adapter-axios-real/lib/adapters/adapters.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/adapters/adapters.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\nimport utils from '../utils.js';\nimport httpAdapter from './http.js';\nimport xhrAdapter from './xhr.js';\nimport fetchAdapter from './fetch.js';\nimport AxiosError from \"../core/AxiosError.js\";\n\nconst knownAdapters = {\n  http: httpAdapter,\n  xhr: xhrAdapter,\n  fetch: fetchAdapter\n}\n\nutils.forEach(knownAdapters, (fn, value) => {\n  if (fn) {\n    try {\n      Object.defineProperty(fn, 'name', {value});\n    } catch (e) {\n      // eslint-disable-next-line no-empty\n    }\n    Object.defineProperty(fn, 'adapterName', {value});\n  }\n});\n\nconst renderReason = (reason) => `- ${reason}`;\n\nconst isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;\n\nexport default {\n  getAdapter: (adapters) => {\n    adapters = utils.isArray(adapters) ? adapters : [adapters];\n\n    const {length} = adapters;\n    let nameOrAdapter;\n    let adapter;\n\n    const rejectedReasons = {};\n\n    for (let i = 0; i < length; i++) {\n      nameOrAdapter = adapters[i];\n      let id;\n\n      adapter = nameOrAdapter;\n\n      if (!isResolvedHandle(nameOrAdapter)) {\n        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];\n\n        if (adapter === undefined) {\n          throw new AxiosError(`Unknown adapter '${id}'`);\n        }\n      }\n\n      if (adapter) {\n        break;\n      }\n\n      rejectedReasons[id || '#' + i] = adapter;\n    }\n\n    if (!adapter) {\n\n      const reasons = Object.entries(rejectedReasons)\n        .map(([id, state]) => `adapter ${id} ` +\n          (state === false ? 'is not supported by the environment' : 'is not available in the build')\n        );\n\n      let s = length ?\n        (reasons.length > 1 ? 'since :\\n' + reasons.map(renderReason).join('\\n') : ' ' + renderReason(reasons[0])) :\n        'as no adapter specified';\n\n      throw new AxiosError(\n        `There is no suitable adapter to dispatch the request ` + s,\n        'ERR_NOT_SUPPORT'\n      );\n    }\n\n    return adapter;\n  },\n  adapters: knownAdapters\n}\n",
            "adapter-axios-real/lib/adapters/xhr.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/adapters/xhr.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\nimport utils from './../utils.js';\nimport settle from './../core/settle.js';\nimport transitionalDefaults from '../defaults/transitional.js';\nimport AxiosError from '../core/AxiosError.js';\nimport CanceledError from '../cancel/CanceledError.js';\nimport parseProtocol from '../helpers/parseProtocol.js';\nimport platform from '../platform/index.js';\nimport AxiosHeaders from '../core/AxiosHeaders.js';\nimport {progressEventReducer} from '../helpers/progressEventReducer.js';\nimport resolveConfig from \"../helpers/resolveConfig.js\";\n\nconst isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';\n\nexport default isXHRAdapterSupported && function (config) {\n  return new Promise(function dispatchXhrRequest(resolve, reject) {\n    const _config = resolveConfig(config);\n    let requestData = _config.data;\n    const requestHeaders = AxiosHeaders.from(_config.headers).normalize();\n    let {responseType, onUploadProgress, onDownloadProgress} = _config;\n    let onCanceled;\n    let uploadThrottled, downloadThrottled;\n    let flushUpload, flushDownload;\n\n    function done() {\n      flushUpload && flushUpload(); // flush events\n      flushDownload && flushDownload(); // flush events\n\n      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);\n\n      _config.signal && _config.signal.removeEventListener('abort', onCanceled);\n    }\n\n    let request = new XMLHttpRequest();\n\n    request.open(_config.method.toUpperCase(), _config.url, true);\n\n    // Set the request timeout in MS\n    request.timeout = _config.timeout;\n\n    function onloadend() {\n      if (!request) {\n        return;\n      }\n      // Prepare the response\n      const responseHeaders = AxiosHeaders.from(\n        'getAllResponseHeaders' in request && request.getAllResponseHeaders()\n      );\n      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?\n        request.responseText : request.response;\n      const response = {\n        data: responseData,\n        status: request.status,\n        statusText: request.statusText,\n        headers: responseHeaders,\n        config,\n        request\n      };\n\n      settle(function _resolve(value) {\n        resolve(value);\n        done();\n      }, function _reject(err) {\n        reject(err);\n        done();\n      }, response);\n\n      // Clean up request\n      request = null;\n    }\n\n    if ('onloadend' in request) {\n      // Use onloadend if available\n      request.onloadend = onloadend;\n    } else {\n      // Listen for ready state to emulate onloadend\n      request.onreadystatechange = function handleLoad() {\n        if (!request || request.readyState !== 4) {\n          return;\n        }\n\n        // The request errored out and we didn't get a response, this will be\n        // handled by onerror instead\n        // With one exception: request that using file: protocol, most browsers\n        // will return status as 0 even though it's a successful request\n        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {\n          return;\n        }\n        // readystate handler is calling before onerror or ontimeout handlers,\n        // so we should call onloadend on the next 'tick'\n        setTimeout(onloadend);\n      };\n    }\n\n    // Handle browser request cancellation (as opposed to a manual cancellation)\n    request.onabort = function handleAbort() {\n      if (!request) {\n        return;\n      }\n\n      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Handle low level network errors\n    request.onerror = function handleError() {\n      // Real errors are hidden from us by the browser\n      // onerror should only fire if it's a network error\n      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Handle timeout\n    request.ontimeout = function handleTimeout() {\n      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';\n      const transitional = _config.transitional || transitionalDefaults;\n      if (_config.timeoutErrorMessage) {\n        timeoutErrorMessage = _config.timeoutErrorMessage;\n      }\n      reject(new AxiosError(\n        timeoutErrorMessage,\n        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,\n        config,\n        request));\n\n      // Clean up request\n      request = null;\n    };\n\n    // Remove Content-Type if data is undefined\n    requestData === undefined && requestHeaders.setContentType(null);\n\n    // Add headers to the request\n    if ('setRequestHeader' in request) {\n      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {\n        request.setRequestHeader(key, val);\n      });\n    }\n\n    // Add withCredentials to request if needed\n    if (!utils.isUndefined(_config.withCredentials)) {\n      request.withCredentials = !!_config.withCredentials;\n    }\n\n    // Add responseType to request if needed\n    if (responseType && responseType !== 'json') {\n      request.responseType = _config.responseType;\n    }\n\n    // Handle progress if needed\n    if (onDownloadProgress) {\n      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));\n      request.addEventListener('progress', downloadThrottled);\n    }\n\n    // Not all browsers support upload events\n    if (onUploadProgress && request.upload) {\n      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));\n\n      request.upload.addEventListener('progress', uploadThrottled);\n\n      request.upload.addEventListener('loadend', flushUpload);\n    }\n\n    if (_config.cancelToken || _config.signal) {\n      // Handle cancellation\n      // eslint-disable-next-line func-names\n      onCanceled = cancel => {\n        if (!request) {\n          return;\n        }\n        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);\n        request.abort();\n        request = null;\n      };\n\n      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);\n      if (_config.signal) {\n        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);\n      }\n    }\n\n    const protocol = parseProtocol(_config.url);\n\n    if (protocol && platform.protocols.indexOf(protocol) === -1) {\n      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));\n      return;\n    }\n\n\n    // Send the request\n    request.send(requestData || null);\n  });\n}\n",
            "adapter-axios-real/lib/core/dispatchRequest.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/core/dispatchRequest.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\n'use strict';\n\nimport transformData from './transformData.js';\nimport isCancel from '../cancel/isCancel.js';\nimport defaults from '../defaults/index.js';\nimport CanceledError from '../cancel/CanceledError.js';\nimport AxiosHeaders from '../core/AxiosHeaders.js';\nimport adapters from \"../adapters/adapters.js\";\n\n/**\n * Throws a `CanceledError` if cancellation has been requested.\n *\n * @param {Object} config The config that is to be used for the request\n *\n * @returns {void}\n */\nfunction throwIfCancellationRequested(config) {\n  if (config.cancelToken) {\n    config.cancelToken.throwIfRequested();\n  }\n\n  if (config.signal && config.signal.aborted) {\n    throw new CanceledError(null, config);\n  }\n}\n\n/**\n * Dispatch a request to the server using the configured adapter.\n *\n * @param {object} config The config that is to be used for the request\n *\n * @returns {Promise} The Promise to be fulfilled\n */\nexport default function dispatchRequest(config) {\n  throwIfCancellationRequested(config);\n\n  config.headers = AxiosHeaders.from(config.headers);\n\n  // Transform request data\n  config.data = transformData.call(\n    config,\n    config.transformRequest\n  );\n\n  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {\n    config.headers.setContentType('application/x-www-form-urlencoded', false);\n  }\n\n  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);\n\n  return adapter(config).then(function onAdapterResolution(response) {\n    throwIfCancellationRequested(config);\n\n    // Transform response data\n    response.data = transformData.call(\n      config,\n      config.transformResponse,\n      response\n    );\n\n    response.headers = AxiosHeaders.from(response.headers);\n\n    return response;\n  }, function onAdapterRejection(reason) {\n    if (!isCancel(reason)) {\n      throwIfCancellationRequested(config);\n\n      // Transform response data\n      if (reason && reason.response) {\n        reason.response.data = transformData.call(\n          config,\n          config.transformResponse,\n          reason.response\n        );\n        reason.response.headers = AxiosHeaders.from(reason.response.headers);\n      }\n    }\n\n    return Promise.reject(reason);\n  });\n}\n",
            "adapter-axios-real/usage.js": "// Example usage written for Software City (not part of axios).\n// It does by hand what axios' dispatchRequest() does: pick an adapter, then call it.\nimport adapters from './lib/adapters/adapters.js';\n\n// Your own adapter: same contract as xhr/http/fetch -> (config) => Promise<response>.\n// No network at all, which makes it handy in unit tests.\nexport function memoryAdapter(config) {\n  const body = JSON.stringify({ id: 1, title: 'Write Software City content' });\n  return Promise.resolve({\n    data: body,\n    status: 200,\n    statusText: 'OK',\n    headers: { 'content-type': 'application/json' },\n    config,\n    request: null\n  });\n}\n\nexport function run() {\n  // In Node, xhr is `false` (unsupported), so getAdapter falls through to ours.\n  const adapter = adapters.getAdapter(['xhr', memoryAdapter]);\n  return adapter({ url: '/todos/1', method: 'get' }).then((response) => {\n    console.log(response.status, response.data);\n  });\n}\n"
          }
        }
      ]
    },
    {
      "id": "decorator",
      "name": "Decorator",
      "family": "Structural",
      "aka": [
        "Wrapper",
        "Middleware"
      ],
      "tagline": "Add behaviour by wrapping an object in another object with the same interface.",
      "intent": "Attach extra responsibilities to an object at runtime without changing its class or creating a subclass for every combination. Each decorator implements the same interface as the object it wraps, does its own small job, and forwards the call inward, so wrappers can be stacked in any order.",
      "analogy": "Dressing for winter: a shirt, then a sweater, then a coat. Each layer is still something you wear, adds one thing (warmth, rain protection), and you choose the combination each morning.",
      "cityShape": "Look for a row of slim decorator buildings with floors at the same height (cost, Write, ServeHTTP) because they all implement one interface. A call pipe enters the outermost wrapper and hops building to building, floor to matching floor, until it reaches the plain concrete component at the end.",
      "roles": [
        {
          "name": "Component",
          "desc": "The shared interface for plain objects and wrappers alike."
        },
        {
          "name": "Concrete Component",
          "desc": "The basic object that does the core work and can be wrapped."
        },
        {
          "name": "Decorator",
          "desc": "Implements the Component and holds a reference to another Component it forwards to."
        },
        {
          "name": "Concrete Decorator",
          "desc": "Adds one specific behaviour before or after forwarding (milk, compression, logging)."
        },
        {
          "name": "Client",
          "desc": "Builds the stack of wrappers and then uses it through the Component interface."
        }
      ],
      "whenToUse": [
        "Features combine freely (milk + caramel + extra shot) and a subclass per combination would explode.",
        "You want to add cross-cutting behaviour (logging, caching, compression, auth) around existing code without editing it.",
        "Behaviour must be switched on or off at runtime, per object, not per class."
      ],
      "pitfalls": [
        "Order matters: compress-then-encrypt is not the same as encrypt-then-compress, and the bug is easy to miss.",
        "Deep stacks are hard to debug; a stack trace shows many near-identical forwarding methods.",
        "Code that checks the concrete type (instanceof Espresso) breaks as soon as the object is wrapped."
      ],
      "related": [
        "adapter",
        "proxy",
        "composite",
        "chain-of-responsibility",
        "strategy"
      ],
      "quiz": [
        {
          "q": "Why does each decorator implement the same interface as the object it wraps?",
          "options": [
            "So it can be wrapped again and used anywhere the plain object is accepted",
            "Because the compiler requires all classes to share an interface",
            "To make it run faster",
            "So it can change the object's class at runtime"
          ],
          "answer": 0,
          "why": "Same interface in, same interface out: that is what lets wrappers stack in any order and stay invisible to the client."
        },
        {
          "q": "Caramel(Milk(Espresso())).cost() is called. Which cost() finishes its own work first?",
          "options": [
            "Caramel's",
            "Milk's",
            "Espresso's",
            "They all run at the same time"
          ],
          "answer": 2,
          "why": "Each decorator forwards inward before adding its price, so the innermost Espresso returns first and the totals are added on the way back out."
        }
      ],
      "demos": [
        {
          "id": "decorator-py-coffee",
          "title": "Coffee with add-ons",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "Milk and caramel are wrappers around any drink. Notice there is no MilkCaramelFilterCoffee class: you build that combination at runtime by nesting objects.",
          "roles": {
            "Component": [
              "decorator-py-coffee/beverage.py#Beverage"
            ],
            "Concrete Component": [
              "decorator-py-coffee/coffees.py#Espresso",
              "decorator-py-coffee/coffees.py#FilterCoffee"
            ],
            "Decorator": [
              "decorator-py-coffee/addons.py#AddOn"
            ],
            "Concrete Decorator": [
              "decorator-py-coffee/addons.py#Milk",
              "decorator-py-coffee/addons.py#Caramel"
            ],
            "Client": [
              "decorator-py-coffee/order.py#main"
            ]
          },
          "trace": [
            {
              "at": "decorator-py-coffee/order.py#main",
              "say": "main() nests drinks: Caramel around Milk around Milk around FilterCoffee. Each layer is still a Beverage."
            },
            {
              "at": "decorator-py-coffee/order.py#print_receipt",
              "say": "print_receipt only knows the Beverage interface, so it treats a plain coffee and a four-layer treat the same way."
            },
            {
              "at": "decorator-py-coffee/addons.py#Caramel.cost",
              "say": "The outer wrapper asks its inner drink for a price first, then adds 0.60."
            },
            {
              "at": "decorator-py-coffee/addons.py#Milk.cost",
              "say": "Milk does the same: forward inward, then add 0.40. Two Milk layers simply mean double milk."
            },
            {
              "at": "decorator-py-coffee/coffees.py#FilterCoffee.cost",
              "say": "The core drink answers 1.60 and the totals add up on the way back out through each wrapper."
            },
            {
              "at": "decorator-py-coffee/addons.py#Milk.description",
              "say": "description() follows the same path, so the receipt reads 'Filter coffee, milk, milk, caramel'."
            }
          ],
          "files": {
            "decorator-py-coffee/addons.py": "from .beverage import Beverage\n\n\n# The Decorator: it IS a Beverage and it HAS a Beverage inside.\nclass AddOn(Beverage):\n    def __init__(self, drink: Beverage):\n        self.drink: Beverage = drink\n\n    def cost(self) -> float:\n        return self.drink.cost()\n\n    def description(self) -> str:\n        return self.drink.description()\n\n\n# Concrete Decorators: each adds a little, then lets the inner drink answer.\nclass Milk(AddOn):\n    def cost(self) -> float:\n        return self.drink.cost() + 0.40\n\n    def description(self) -> str:\n        return self.drink.description() + \", milk\"\n\n\nclass Caramel(AddOn):\n    def cost(self) -> float:\n        return self.drink.cost() + 0.60\n\n    def description(self) -> str:\n        return self.drink.description() + \", caramel\"\n",
            "decorator-py-coffee/beverage.py": "from abc import ABC, abstractmethod\n\n\n# The Component: everything the café sells looks like this.\nclass Beverage(ABC):\n    @abstractmethod\n    def cost(self) -> float:\n        ...\n\n    @abstractmethod\n    def description(self) -> str:\n        ...\n",
            "decorator-py-coffee/coffees.py": "from .beverage import Beverage\n\n\n# Concrete Components: plain drinks that can be wrapped.\nclass Espresso(Beverage):\n    def cost(self) -> float:\n        return 2.00\n\n    def description(self) -> str:\n        return \"Espresso\"\n\n\nclass FilterCoffee(Beverage):\n    def cost(self) -> float:\n        return 1.60\n\n    def description(self) -> str:\n        return \"Filter coffee\"\n",
            "decorator-py-coffee/order.py": "from .coffees import Espresso, FilterCoffee\nfrom .addons import Milk, Caramel\n\n\ndef print_receipt(drink) -> None:\n    print(f\"{drink.description()}: {drink.cost():.2f} EUR\")\n\n\ndef main() -> None:\n    # Wrap layer by layer. Each wrapper is still \"a Beverage\".\n    latte = Milk(Espresso())\n    treat = Caramel(Milk(Milk(FilterCoffee())))\n    print_receipt(latte)\n    print_receipt(treat)\n\n\nif __name__ == \"__main__\":\n    main()\n"
          }
        },
        {
          "id": "decorator-cs-savefiles",
          "title": "Compressed, encrypted save games",
          "lang": "C#",
          "level": "intermediate",
          "source": null,
          "story": "A game's save system writes to an IDataSource. Wrapping the file source in compression and encryption decorators adds both features without touching FileDataSource or SaveSystem.",
          "roles": {
            "Component": [
              "decorator-cs-savefiles/IDataSource.cs#IDataSource"
            ],
            "Concrete Component": [
              "decorator-cs-savefiles/FileDataSource.cs#FileDataSource"
            ],
            "Decorator": [
              "decorator-cs-savefiles/DataSourceDecorator.cs#DataSourceDecorator"
            ],
            "Concrete Decorator": [
              "decorator-cs-savefiles/EncryptionDecorator.cs#EncryptionDecorator",
              "decorator-cs-savefiles/CompressionDecorator.cs#CompressionDecorator"
            ],
            "Client": [
              "decorator-cs-savefiles/SaveSystem.cs#SaveSystem"
            ]
          },
          "trace": [
            {
              "at": "decorator-cs-savefiles/SaveSystem.cs#SaveSystem.Main",
              "say": "Main stacks encryption around compression around the file. SaveSystem receives one IDataSource and never sees the layers."
            },
            {
              "at": "decorator-cs-savefiles/SaveSystem.cs#SaveSystem.Save",
              "say": "Save builds a small JSON string and calls Write on whatever it was given."
            },
            {
              "at": "decorator-cs-savefiles/EncryptionDecorator.cs#EncryptionDecorator.Write",
              "say": "The outer layer scrambles the text, then hands it inward via base.Write."
            },
            {
              "at": "decorator-cs-savefiles/DataSourceDecorator.cs#DataSourceDecorator.Write",
              "say": "The base decorator holds the forwarding logic once, so concrete decorators only add their own twist."
            },
            {
              "at": "decorator-cs-savefiles/CompressionDecorator.cs#CompressionDecorator.Write",
              "say": "The next layer gzips the scrambled text and forwards the result."
            },
            {
              "at": "decorator-cs-savefiles/FileDataSource.cs#FileDataSource.Write",
              "say": "Finally the plain component writes bytes to disk, unaware of any encryption or compression."
            },
            {
              "at": "decorator-cs-savefiles/EncryptionDecorator.cs#EncryptionDecorator.Read",
              "say": "Reading runs the layers in reverse: file, decompress, unscramble. Swap the wrapping order and both directions change together."
            }
          ],
          "files": {
            "decorator-cs-savefiles/CompressionDecorator.cs": "using System;\nusing System.IO;\nusing System.IO.Compression;\nusing System.Text;\n\n// Concrete Decorator: shrinks data on the way in, expands it on the way out.\npublic class CompressionDecorator : DataSourceDecorator\n{\n    public CompressionDecorator(IDataSource inner) : base(inner)\n    {\n    }\n\n    public override void Write(string data)\n    {\n        var output = new MemoryStream();\n        using (var gzip = new GZipStream(output, CompressionLevel.Optimal))\n        {\n            var bytes = Encoding.UTF8.GetBytes(data);\n            gzip.Write(bytes, 0, bytes.Length);\n        }\n        base.Write(Convert.ToBase64String(output.ToArray()));\n    }\n\n    public override string Read()\n    {\n        var input = new MemoryStream(Convert.FromBase64String(base.Read()));\n        using var gzip = new GZipStream(input, CompressionMode.Decompress);\n        using var reader = new StreamReader(gzip, Encoding.UTF8);\n        return reader.ReadToEnd();\n    }\n}\n",
            "decorator-cs-savefiles/DataSourceDecorator.cs": "// The Decorator base: same interface, plus a reference to the wrapped source.\npublic abstract class DataSourceDecorator : IDataSource\n{\n    protected readonly IDataSource inner;\n\n    protected DataSourceDecorator(IDataSource inner)\n    {\n        this.inner = inner;\n    }\n\n    public virtual void Write(string data)\n    {\n        inner.Write(data);\n    }\n\n    public virtual string Read()\n    {\n        return inner.Read();\n    }\n}\n",
            "decorator-cs-savefiles/EncryptionDecorator.cs": "using System;\nusing System.Text;\n\n// Concrete Decorator: scrambles data so players cannot edit their save by hand.\n// (A simple XOR keeps the demo short; use real crypto in production.)\npublic class EncryptionDecorator : DataSourceDecorator\n{\n    private readonly byte key;\n\n    public EncryptionDecorator(IDataSource inner, byte key) : base(inner)\n    {\n        this.key = key;\n    }\n\n    public override void Write(string data)\n    {\n        base.Write(Scramble(data));\n    }\n\n    public override string Read()\n    {\n        return Scramble(base.Read());\n    }\n\n    private string Scramble(string text)\n    {\n        var bytes = Encoding.UTF8.GetBytes(text);\n        for (int i = 0; i < bytes.Length; i++)\n        {\n            bytes[i] ^= key;\n        }\n        return Encoding.UTF8.GetString(bytes);\n    }\n}\n",
            "decorator-cs-savefiles/FileDataSource.cs": "using System.IO;\n\n// The Concrete Component: plain text on disk, nothing clever.\npublic class FileDataSource : IDataSource\n{\n    private readonly string path;\n\n    public FileDataSource(string path)\n    {\n        this.path = path;\n    }\n\n    public void Write(string data)\n    {\n        File.WriteAllText(path, data);\n    }\n\n    public string Read()\n    {\n        return File.ReadAllText(path);\n    }\n}\n",
            "decorator-cs-savefiles/IDataSource.cs": "// The Component: anything that can store and load a save game.\npublic interface IDataSource\n{\n    void Write(string data);\n    string Read();\n}\n",
            "decorator-cs-savefiles/SaveSystem.cs": "using System;\n\n// The Client: it only sees an IDataSource. How many layers? It does not care.\npublic class SaveSystem\n{\n    private readonly IDataSource storage;\n\n    public SaveSystem(IDataSource storage)\n    {\n        this.storage = storage;\n    }\n\n    public void Save(int level, int gold)\n    {\n        storage.Write($\"{{\\\"level\\\":{level},\\\"gold\\\":{gold}}}\");\n    }\n\n    public string Load()\n    {\n        return storage.Read();\n    }\n\n    public static void Main()\n    {\n        // Order matters: encrypt first, then compress the encrypted text, then write the file.\n        IDataSource source = new EncryptionDecorator(\n            new CompressionDecorator(new FileDataSource(\"slot1.sav\")), 0x5A);\n        var saves = new SaveSystem(source);\n        saves.Save(7, 1250);\n        Console.WriteLine(saves.Load());\n    }\n}\n"
          }
        },
        {
          "id": "decorator-chi-real",
          "title": "chi: HTTP middleware as decorators",
          "lang": "Go",
          "level": "advanced",
          "source": {
            "repo": "go-chi/chi",
            "url": "https://github.com/go-chi/chi/blob/v5.2.1/chain.go",
            "license": "MIT",
            "note": "chain.go, middleware/nocache.go, middleware/heartbeat.go and middleware/timeout.go are verbatim from chi v5.2.1 (header comment added). main.go was written for Software City."
          },
          "story": "In Go, a middleware is a function from http.Handler to http.Handler. Each one wraps the next, adds a header, short-circuits a ping or sets a deadline, then calls ServeHTTP inward. Real decorators, written as functions.",
          "roles": {
            "Component": [
              "decorator-chi-real/chain.go#ChainHandler"
            ],
            "Concrete Component": [
              "decorator-chi-real/main.go#hello"
            ],
            "Decorator": [
              "decorator-chi-real/chain.go#chain"
            ],
            "Concrete Decorator": [
              "decorator-chi-real/middleware/nocache.go#NoCache",
              "decorator-chi-real/middleware/heartbeat.go#Heartbeat",
              "decorator-chi-real/middleware/timeout.go#Timeout",
              "decorator-chi-real/main.go#logRequests"
            ],
            "Client": [
              "decorator-chi-real/main.go#main"
            ]
          },
          "trace": [
            {
              "at": "decorator-chi-real/main.go#main",
              "say": "main lists four middlewares and the final hello handler. The list is the decorator stack, outermost first."
            },
            {
              "at": "decorator-chi-real/chain.go#chain",
              "say": "chain() wraps from the inside out: the last middleware wraps the endpoint, the one before wraps that, and so on."
            },
            {
              "at": "decorator-chi-real/chain.go#ChainHandler.ServeHTTP",
              "say": "A request enters the outermost wrapper. Every layer has the same ServeHTTP shape, so the caller cannot tell how deep it goes."
            },
            {
              "at": "decorator-chi-real/main.go#logRequests",
              "say": "Our logger starts a timer, forwards inward with next.ServeHTTP, then logs after the inner layers finish."
            },
            {
              "at": "decorator-chi-real/middleware/heartbeat.go#Heartbeat",
              "say": "Heartbeat may answer '/ping' itself and never call inward. A decorator may also short-circuit."
            },
            {
              "at": "decorator-chi-real/middleware/nocache.go#NoCache",
              "say": "NoCache strips ETag headers and adds no-cache headers, then calls h.ServeHTTP to continue."
            },
            {
              "at": "decorator-chi-real/middleware/timeout.go#Timeout",
              "say": "Timeout attaches a deadline to the request context and checks it after the inner handler returns."
            },
            {
              "at": "decorator-chi-real/main.go#hello",
              "say": "At the centre, hello writes the body. It knows nothing about logging, caching or timeouts."
            }
          ],
          "files": {
            "decorator-chi-real/chain.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/chain.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka (https://github.com/pkieltyka), Google Inc. Included for study.\n\npackage chi\n\nimport \"net/http\"\n\n// Chain returns a Middlewares type from a slice of middleware handlers.\nfunc Chain(middlewares ...func(http.Handler) http.Handler) Middlewares {\n\treturn Middlewares(middlewares)\n}\n\n// Handler builds and returns a http.Handler from the chain of middlewares,\n// with `h http.Handler` as the final handler.\nfunc (mws Middlewares) Handler(h http.Handler) http.Handler {\n\treturn &ChainHandler{h, chain(mws, h), mws}\n}\n\n// HandlerFunc builds and returns a http.Handler from the chain of middlewares,\n// with `h http.Handler` as the final handler.\nfunc (mws Middlewares) HandlerFunc(h http.HandlerFunc) http.Handler {\n\treturn &ChainHandler{h, chain(mws, h), mws}\n}\n\n// ChainHandler is a http.Handler with support for handler composition and\n// execution.\ntype ChainHandler struct {\n\tEndpoint    http.Handler\n\tchain       http.Handler\n\tMiddlewares Middlewares\n}\n\nfunc (c *ChainHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n\tc.chain.ServeHTTP(w, r)\n}\n\n// chain builds a http.Handler composed of an inline middleware stack and endpoint\n// handler in the order they are passed.\nfunc chain(middlewares []func(http.Handler) http.Handler, endpoint http.Handler) http.Handler {\n\t// Return ahead of time if there aren't any middlewares for the chain\n\tif len(middlewares) == 0 {\n\t\treturn endpoint\n\t}\n\n\t// Wrap the end handler with the middleware chain\n\th := middlewares[len(middlewares)-1](endpoint)\n\tfor i := len(middlewares) - 2; i >= 0; i-- {\n\t\th = middlewares[i](h)\n\t}\n\n\treturn h\n}\n",
            "decorator-chi-real/main.go": "// Example usage written for Software City (not part of chi).\n// Every middleware takes an http.Handler and returns an http.Handler:\n// the same interface in and out, which is exactly the Decorator pattern.\npackage main\n\nimport (\n\t\"log\"\n\t\"net/http\"\n\t\"time\"\n\n\t\"github.com/go-chi/chi/v5\"\n\t\"github.com/go-chi/chi/v5/middleware\"\n)\n\n// The concrete component: the handler that does the real work.\nfunc hello(w http.ResponseWriter, r *http.Request) {\n\tw.Write([]byte(\"hello, city builder\"))\n}\n\n// A hand-written decorator in the same style as chi's own middleware.\nfunc logRequests(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tstart := time.Now()\n\t\tnext.ServeHTTP(w, r)\n\t\tlog.Printf(\"%s %s took %v\", r.Method, r.URL.Path, time.Since(start))\n\t})\n}\n\nfunc main() {\n\tstack := chi.Chain(\n\t\tlogRequests,\n\t\tmiddleware.Heartbeat(\"/ping\"),\n\t\tmiddleware.NoCache,\n\t\tmiddleware.Timeout(2*time.Second),\n\t)\n\thandler := stack.HandlerFunc(hello)\n\thttp.ListenAndServe(\":3000\", handler)\n}\n",
            "decorator-chi-real/middleware/heartbeat.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/heartbeat.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka (https://github.com/pkieltyka), Google Inc. Included for study.\n\npackage middleware\n\nimport (\n\t\"net/http\"\n\t\"strings\"\n)\n\n// Heartbeat endpoint middleware useful to setting up a path like\n// `/ping` that load balancers or uptime testing external services\n// can make a request before hitting any routes. It's also convenient\n// to place this above ACL middlewares as well.\nfunc Heartbeat(endpoint string) func(http.Handler) http.Handler {\n\tf := func(h http.Handler) http.Handler {\n\t\tfn := func(w http.ResponseWriter, r *http.Request) {\n\t\t\tif (r.Method == \"GET\" || r.Method == \"HEAD\") && strings.EqualFold(r.URL.Path, endpoint) {\n\t\t\t\tw.Header().Set(\"Content-Type\", \"text/plain\")\n\t\t\t\tw.WriteHeader(http.StatusOK)\n\t\t\t\tw.Write([]byte(\".\"))\n\t\t\t\treturn\n\t\t\t}\n\t\t\th.ServeHTTP(w, r)\n\t\t}\n\t\treturn http.HandlerFunc(fn)\n\t}\n\treturn f\n}\n",
            "decorator-chi-real/middleware/nocache.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/nocache.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka (https://github.com/pkieltyka), Google Inc. Included for study.\n\npackage middleware\n\n// Ported from Goji's middleware, source:\n// https://github.com/zenazn/goji/tree/master/web/middleware\n\nimport (\n\t\"net/http\"\n\t\"time\"\n)\n\n// Unix epoch time\nvar epoch = time.Unix(0, 0).UTC().Format(http.TimeFormat)\n\n// Taken from https://github.com/mytrile/nocache\nvar noCacheHeaders = map[string]string{\n\t\"Expires\":         epoch,\n\t\"Cache-Control\":   \"no-cache, no-store, no-transform, must-revalidate, private, max-age=0\",\n\t\"Pragma\":          \"no-cache\",\n\t\"X-Accel-Expires\": \"0\",\n}\n\nvar etagHeaders = []string{\n\t\"ETag\",\n\t\"If-Modified-Since\",\n\t\"If-Match\",\n\t\"If-None-Match\",\n\t\"If-Range\",\n\t\"If-Unmodified-Since\",\n}\n\n// NoCache is a simple piece of middleware that sets a number of HTTP headers to prevent\n// a router (or subrouter) from being cached by an upstream proxy and/or client.\n//\n// As per http://wiki.nginx.org/HttpProxyModule - NoCache sets:\n//\n//\tExpires: Thu, 01 Jan 1970 00:00:00 UTC\n//\tCache-Control: no-cache, private, max-age=0\n//\tX-Accel-Expires: 0\n//\tPragma: no-cache (for HTTP/1.0 proxies/clients)\nfunc NoCache(h http.Handler) http.Handler {\n\tfn := func(w http.ResponseWriter, r *http.Request) {\n\n\t\t// Delete any ETag headers that may have been set\n\t\tfor _, v := range etagHeaders {\n\t\t\tif r.Header.Get(v) != \"\" {\n\t\t\t\tr.Header.Del(v)\n\t\t\t}\n\t\t}\n\n\t\t// Set our NoCache headers\n\t\tfor k, v := range noCacheHeaders {\n\t\t\tw.Header().Set(k, v)\n\t\t}\n\n\t\th.ServeHTTP(w, r)\n\t}\n\n\treturn http.HandlerFunc(fn)\n}\n",
            "decorator-chi-real/middleware/timeout.go": "// Source: chi v5.2.1 — https://github.com/go-chi/chi/blob/v5.2.1/middleware/timeout.go\n// MIT License, Copyright (c) 2015-present Peter Kieltyka (https://github.com/pkieltyka), Google Inc. Included for study.\n\npackage middleware\n\nimport (\n\t\"context\"\n\t\"net/http\"\n\t\"time\"\n)\n\n// Timeout is a middleware that cancels ctx after a given timeout and return\n// a 504 Gateway Timeout error to the client.\n//\n// It's required that you select the ctx.Done() channel to check for the signal\n// if the context has reached its deadline and return, otherwise the timeout\n// signal will be just ignored.\n//\n// ie. a route/handler may look like:\n//\n//\tr.Get(\"/long\", func(w http.ResponseWriter, r *http.Request) {\n//\t\tctx := r.Context()\n//\t\tprocessTime := time.Duration(rand.Intn(4)+1) * time.Second\n//\n//\t\tselect {\n//\t\tcase <-ctx.Done():\n//\t\t\treturn\n//\n//\t\tcase <-time.After(processTime):\n//\t\t\t// The above channel simulates some hard work.\n//\t\t}\n//\n//\t\tw.Write([]byte(\"done\"))\n//\t})\nfunc Timeout(timeout time.Duration) func(next http.Handler) http.Handler {\n\treturn func(next http.Handler) http.Handler {\n\t\tfn := func(w http.ResponseWriter, r *http.Request) {\n\t\t\tctx, cancel := context.WithTimeout(r.Context(), timeout)\n\t\t\tdefer func() {\n\t\t\t\tcancel()\n\t\t\t\tif ctx.Err() == context.DeadlineExceeded {\n\t\t\t\t\tw.WriteHeader(http.StatusGatewayTimeout)\n\t\t\t\t}\n\t\t\t}()\n\n\t\t\tr = r.WithContext(ctx)\n\t\t\tnext.ServeHTTP(w, r)\n\t\t}\n\t\treturn http.HandlerFunc(fn)\n\t}\n}\n"
          }
        }
      ]
    },
    {
      "id": "facade",
      "name": "Facade",
      "family": "Structural",
      "aka": [
        "Front door",
        "Service layer"
      ],
      "tagline": "One simple front door in front of a group of complicated classes.",
      "intent": "A task often needs several subsystem classes called in the right order with the right setup. A facade offers a small, task-shaped API that does that orchestration, so client code stays short and depends on one class instead of many. The subsystems remain available for anyone who needs the details.",
      "analogy": "A hotel reception desk: you ask for a room, a wake-up call and a taxi. Behind the desk, housekeeping, the phone system and the taxi company each do their part, but you only talk to one person.",
      "cityShape": "Look for one facade building whose few floors each send several call pipes out to a cluster of subsystem buildings. Client buildings connect only to the facade, so their arrows all converge on it while the subsystem cluster has no arrows back to the clients.",
      "roles": [
        {
          "name": "Facade",
          "desc": "Offers a few high-level methods and coordinates the subsystems to carry them out."
        },
        {
          "name": "Subsystem",
          "desc": "The classes that do the actual work. They do not know the facade exists."
        },
        {
          "name": "Client",
          "desc": "Calls the facade instead of wiring the subsystems itself."
        }
      ],
      "whenToUse": [
        "A common task needs four or five classes called in a fixed order, and many callers repeat that dance.",
        "You want to shield game or app code from a low-level API (audio buses, HTTP, payment SDKs) so it can change later.",
        "You are layering a system and want one entry point per layer."
      ],
      "pitfalls": [
        "A facade that keeps growing becomes a 'god object' that knows everything; split it by task.",
        "Hiding too much can block advanced users; keep the subsystems reachable for special cases.",
        "A facade is not a security boundary: callers can still use the subsystems directly unless you restrict them."
      ],
      "related": [
        "adapter",
        "mediator",
        "singleton",
        "proxy"
      ],
      "quiz": [
        {
          "q": "How is a Facade different from an Adapter?",
          "options": [
            "A facade simplifies many classes behind a new API; an adapter makes one class fit an existing interface",
            "A facade must implement an interface; an adapter must not",
            "They are the same pattern with different names",
            "An adapter always wraps several classes"
          ],
          "answer": 0,
          "why": "Adapter is about matching an expected interface. Facade is about simplifying: it invents a smaller interface over a whole group of classes."
        },
        {
          "q": "In the shop demo, a new tax service must run before charging. Which file changes?",
          "options": [
            "checkout.php only",
            "OrderFacade.php (and the new service)",
            "Every subsystem class",
            "None, facades update themselves"
          ],
          "answer": 1,
          "why": "Orchestration lives in the facade, so the order of steps changes there. Clients keep calling placeOrder() unchanged."
        }
      ],
      "demos": [
        {
          "id": "facade-php-checkout",
          "title": "One-call checkout",
          "lang": "PHP",
          "level": "beginner",
          "source": null,
          "story": "Placing an order means reserving stock, charging a card and booking a courier. OrderFacade does all three in placeOrder(); the controller makes one call.",
          "roles": {
            "Facade": [
              "facade-php-checkout/OrderFacade.php#OrderFacade"
            ],
            "Subsystem": [
              "facade-php-checkout/Inventory.php#Inventory",
              "facade-php-checkout/PaymentGateway.php#PaymentGateway",
              "facade-php-checkout/Shipping.php#Shipping"
            ],
            "Client": [
              "facade-php-checkout/checkout.php#handleCheckout"
            ]
          },
          "trace": [
            {
              "at": "facade-php-checkout/checkout.php#handleCheckout",
              "say": "The controller creates the facade and asks for an order. It never sees inventory, payments or shipping."
            },
            {
              "at": "facade-php-checkout/OrderFacade.php#OrderFacade.placeOrder",
              "say": "placeOrder() knows the right sequence: reserve, charge, ship. That knowledge now lives in one place."
            },
            {
              "at": "facade-php-checkout/Inventory.php#Inventory.reserve",
              "say": "First the stock check. If the item is sold out, the facade stops early and nobody is charged."
            },
            {
              "at": "facade-php-checkout/PaymentGateway.php#PaymentGateway.charge",
              "say": "Then the card is charged. The payment class knows nothing about stock or parcels."
            },
            {
              "at": "facade-php-checkout/Shipping.php#Shipping.schedule",
              "say": "Last, a courier is booked. The facade combines the results into one friendly message."
            }
          ],
          "files": {
            "facade-php-checkout/Inventory.php": "<?php\n// Subsystem: knows about stock, nothing about money or parcels.\nclass Inventory\n{\n    private array $stock = ['mug' => 3, 'poster' => 0];\n\n    public function reserve(string $sku): bool\n    {\n        if (($this->stock[$sku] ?? 0) < 1) {\n            return false;\n        }\n        $this->stock[$sku] -= 1;\n        return true;\n    }\n}\n",
            "facade-php-checkout/OrderFacade.php": "<?php\nrequire_once __DIR__ . '/Inventory.php';\nrequire_once __DIR__ . '/PaymentGateway.php';\nrequire_once __DIR__ . '/Shipping.php';\n\n// The Facade: one simple method in front of three subsystems.\nclass OrderFacade\n{\n    private Inventory $inventory;\n    private PaymentGateway $payments;\n    private Shipping $shipping;\n\n    public function __construct()\n    {\n        $this->inventory = new Inventory();\n        $this->payments = new PaymentGateway();\n        $this->shipping = new Shipping();\n    }\n\n    public function placeOrder(string $sku, float $price, string $email, string $address): string\n    {\n        if (!$this->inventory->reserve($sku)) {\n            return \"Sorry, {$sku} is sold out.\";\n        }\n        $txn = $this->payments->charge($email, $price);\n        $tracking = $this->shipping->schedule($sku, $address);\n        return \"Order paid ({$txn}), tracking code {$tracking}.\";\n    }\n}\n",
            "facade-php-checkout/PaymentGateway.php": "<?php\n// Subsystem: talks to the card provider.\nclass PaymentGateway\n{\n    public function charge(string $email, float $amount): string\n    {\n        echo \"Charged {$amount} EUR to {$email}\\n\";\n        return 'txn_' . substr(md5($email . $amount), 0, 8);\n    }\n}\n",
            "facade-php-checkout/Shipping.php": "<?php\n// Subsystem: books a courier and returns a tracking code.\nclass Shipping\n{\n    public function schedule(string $sku, string $address): string\n    {\n        echo \"Courier booked for {$sku} to {$address}\\n\";\n        return 'TRK-' . strtoupper(substr(md5($address), 0, 6));\n    }\n}\n",
            "facade-php-checkout/checkout.php": "<?php\nrequire_once __DIR__ . '/OrderFacade.php';\n\n// The Client: a controller that only knows the facade.\nfunction handleCheckout(): void\n{\n    $shop = new OrderFacade();\n    echo $shop->placeOrder('mug', 12.5, 'ana@example.com', 'Main St 1, Augsburg') . \"\\n\";\n    echo $shop->placeOrder('poster', 8.0, 'ben@example.com', 'Hill Rd 4, Corfu') . \"\\n\";\n}\n\nhandleCheckout();\n"
          }
        },
        {
          "id": "facade-gd-audio",
          "title": "Audio autoload for a Godot game",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "An Audio autoload hides a crossfading music deck, a pool of positional sound players and the AudioServer bus API. Gameplay scripts just say play_sfx(\"coin\", position).",
          "roles": {
            "Facade": [
              "facade-gd-audio/audio_manager.gd#AudioManager"
            ],
            "Subsystem": [
              "facade-gd-audio/music_deck.gd#MusicDeck",
              "facade-gd-audio/sfx_pool.gd#SfxPool",
              "facade-gd-audio/bus_mixer.gd#BusMixer"
            ],
            "Client": [
              "facade-gd-audio/player.gd#Player",
              "facade-gd-audio/pause_menu.gd"
            ]
          },
          "trace": [
            {
              "at": "facade-gd-audio/audio_manager.gd#_ready",
              "say": "The facade builds its three subsystems once, at startup. No other script ever creates them."
            },
            {
              "at": "facade-gd-audio/pause_menu.gd#_ready",
              "say": "The menu asks for forest music by name. It does not know that crossfading needs two players and a tween."
            },
            {
              "at": "facade-gd-audio/music_deck.gd#crossfade_to",
              "say": "The music subsystem fades the new track in and the old one out in parallel, then stops the old player."
            },
            {
              "at": "facade-gd-audio/player.gd#collect_coin",
              "say": "The player script plays a sound with one call, passing only a name and a position."
            },
            {
              "at": "facade-gd-audio/sfx_pool.gd#play_at",
              "say": "Behind the facade, a round-robin pool picks a free player so overlapping sounds do not cut each other off."
            },
            {
              "at": "facade-gd-audio/audio_manager.gd#on_pause_changed",
              "say": "Pausing is one facade call that coordinates two subsystems: muffle the music bus and silence all effects."
            },
            {
              "at": "facade-gd-audio/bus_mixer.gd#set_muffled",
              "say": "Only the mixer touches AudioServer indices and effect slots. If the bus layout changes, only this file changes."
            }
          ],
          "files": {
            "facade-gd-audio/audio_manager.gd": "class_name AudioManager\nextends Node\n\n# The Facade (registered as the autoload \"Audio\").\n# Gameplay code calls four friendly methods; the subsystems stay hidden.\nconst SOUNDS := {\n\t\"jump\": preload(\"res://audio/jump.wav\"),\n\t\"coin\": preload(\"res://audio/coin.wav\"),\n\t\"hurt\": preload(\"res://audio/hurt.wav\"),\n}\nconst TRACKS := {\n\t\"forest\": preload(\"res://audio/forest_theme.ogg\"),\n\t\"boss\": preload(\"res://audio/boss_theme.ogg\"),\n}\n\nvar music: MusicDeck\nvar sfx: SfxPool\nvar mixer: BusMixer\n\nfunc _ready() -> void:\n\tmusic = MusicDeck.new()\n\tsfx = SfxPool.new()\n\tmixer = BusMixer.new()\n\tadd_child(music)\n\tadd_child(sfx)\n\nfunc play_level_music(track: String) -> void:\n\tmusic.crossfade_to(TRACKS[track], 1.5)\n\nfunc play_sfx(sound: String, at: Vector2) -> void:\n\tsfx.play_at(SOUNDS[sound], at)\n\nfunc set_volume(percent: float) -> void:\n\tmixer.set_bus_percent(\"Master\", percent)\n\nfunc on_pause_changed(paused: bool) -> void:\n\tmixer.set_muffled(\"Music\", paused)\n\tif paused:\n\t\tsfx.stop_all()\n",
            "facade-gd-audio/bus_mixer.gd": "class_name BusMixer\nextends RefCounted\n\n# Subsystem: wraps the low-level AudioServer bus API (indices, decibels, effects).\nfunc set_bus_percent(bus: String, percent: float) -> void:\n\tvar idx := AudioServer.get_bus_index(bus)\n\tAudioServer.set_bus_volume_db(idx, linear_to_db(clamp(percent / 100.0, 0.0, 1.0)))\n\nfunc set_muffled(bus: String, on: bool) -> void:\n\tvar idx := AudioServer.get_bus_index(bus)\n\t# Effect 0 on the Music bus is a low-pass filter set up in the bus layout.\n\tAudioServer.set_bus_effect_enabled(idx, 0, on)\n",
            "facade-gd-audio/music_deck.gd": "class_name MusicDeck\nextends Node\n\n# Subsystem: two players and a tween, so tracks can crossfade.\nvar _a := AudioStreamPlayer.new()\nvar _b := AudioStreamPlayer.new()\n\nfunc _ready() -> void:\n\tfor p in [_a, _b]:\n\t\tp.bus = \"Music\"\n\t\tadd_child(p)\n\nfunc crossfade_to(stream: AudioStream, seconds: float) -> void:\n\tvar old := _a if _a.playing else _b\n\tvar new := _b if old == _a else _a\n\tnew.stream = stream\n\tnew.volume_db = -40.0\n\tnew.play()\n\tvar tween := create_tween().set_parallel()\n\ttween.tween_property(new, \"volume_db\", 0.0, seconds)\n\ttween.tween_property(old, \"volume_db\", -40.0, seconds)\n\ttween.chain().tween_callback(old.stop)\n",
            "facade-gd-audio/pause_menu.gd": "extends Control\n\n# Another Client: the pause menu and the options slider.\n@onready var audio: AudioManager = get_node(\"/root/Audio\")\n\nfunc _ready() -> void:\n\taudio.play_level_music(\"forest\")\n\nfunc toggle_pause() -> void:\n\tget_tree().paused = not get_tree().paused\n\tvisible = get_tree().paused\n\taudio.on_pause_changed(get_tree().paused)\n\nfunc _on_volume_slider_value_changed(value: float) -> void:\n\taudio.set_volume(value)\n",
            "facade-gd-audio/player.gd": "class_name Player\nextends CharacterBody2D\n\n# A Client: one line per sound, no players, buses or pools in sight.\n@onready var audio: AudioManager = get_node(\"/root/Audio\")\n\nfunc jump() -> void:\n\tvelocity.y = -400.0\n\taudio.play_sfx(\"jump\", global_position)\n\nfunc collect_coin() -> void:\n\taudio.play_sfx(\"coin\", global_position)\n",
            "facade-gd-audio/sfx_pool.gd": "class_name SfxPool\nextends Node\n\n# Subsystem: a small pool of positional players so sounds can overlap.\nconst POOL_SIZE := 8\nvar _players: Array[AudioStreamPlayer2D] = []\nvar _next := 0\n\nfunc _ready() -> void:\n\tfor i in POOL_SIZE:\n\t\tvar p := AudioStreamPlayer2D.new()\n\t\tp.bus = \"SFX\"\n\t\tadd_child(p)\n\t\t_players.append(p)\n\nfunc play_at(stream: AudioStream, at: Vector2) -> void:\n\tvar p := _players[_next]\n\t_next = (_next + 1) % POOL_SIZE\n\tp.stream = stream\n\tp.global_position = at\n\tp.play()\n\nfunc stop_all() -> void:\n\tfor p in _players:\n\t\tp.stop()\n"
          }
        },
        {
          "id": "facade-axios-real",
          "title": "axios: one callable object over a whole HTTP stack",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "axios/axios",
            "url": "https://github.com/axios/axios/blob/v1.7.9/lib/axios.js",
            "license": "MIT",
            "note": "lib/axios.js, lib/helpers/bind.js and lib/core/dispatchRequest.js are verbatim from axios v1.7.9; lib/core/Axios.js is verbatim with one marked trim (option validation). usage.js was written for Software City."
          },
          "story": "The default export of axios is a function with helpers attached. createInstance() binds it to an Axios object that hides config merging, interceptors and adapters. Users call axios.get() and never touch those pieces.",
          "roles": {
            "Facade": [
              "facade-axios-real/lib/axios.js#createInstance"
            ],
            "Subsystem": [
              "facade-axios-real/lib/core/Axios.js#Axios",
              "facade-axios-real/lib/core/dispatchRequest.js#dispatchRequest",
              "facade-axios-real/lib/helpers/bind.js#bind"
            ],
            "Client": [
              "facade-axios-real/usage.js#loadTodo",
              "facade-axios-real/usage.js#useApiClient"
            ]
          },
          "trace": [
            {
              "at": "facade-axios-real/lib/axios.js#createInstance",
              "say": "createInstance() builds an Axios object, binds its request() to a plain function and copies helpers onto it. That function is the facade users import."
            },
            {
              "at": "facade-axios-real/lib/helpers/bind.js#bind",
              "say": "bind() makes the facade callable as axios(config) while still running Axios.prototype.request with the right 'this'."
            },
            {
              "at": "facade-axios-real/usage.js#loadTodo",
              "say": "The client writes one line: axios.get(url). No config objects, interceptors or adapters in sight."
            },
            {
              "at": "facade-axios-real/lib/core/Axios.js#Axios.request",
              "say": "Behind the facade, request() adds stack-trace polish around _request(), a detail the caller never deals with."
            },
            {
              "at": "facade-axios-real/lib/core/Axios.js#Axios._request",
              "say": "_request() merges defaults, flattens headers and threads the call through request and response interceptors."
            },
            {
              "at": "facade-axios-real/lib/core/dispatchRequest.js#dispatchRequest",
              "say": "Deepest layer: transform the data and hand it to a platform adapter. Three subsystems, still one call for the user."
            },
            {
              "at": "facade-axios-real/usage.js#useApiClient",
              "say": "axios.create() returns a second facade with its own defaults. Advanced users can still reach the interceptor subsystem."
            }
          ],
          "files": {
            "facade-axios-real/lib/axios.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/axios.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\n'use strict';\n\nimport utils from './utils.js';\nimport bind from './helpers/bind.js';\nimport Axios from './core/Axios.js';\nimport mergeConfig from './core/mergeConfig.js';\nimport defaults from './defaults/index.js';\nimport formDataToJSON from './helpers/formDataToJSON.js';\nimport CanceledError from './cancel/CanceledError.js';\nimport CancelToken from './cancel/CancelToken.js';\nimport isCancel from './cancel/isCancel.js';\nimport {VERSION} from './env/data.js';\nimport toFormData from './helpers/toFormData.js';\nimport AxiosError from './core/AxiosError.js';\nimport spread from './helpers/spread.js';\nimport isAxiosError from './helpers/isAxiosError.js';\nimport AxiosHeaders from \"./core/AxiosHeaders.js\";\nimport adapters from './adapters/adapters.js';\nimport HttpStatusCode from './helpers/HttpStatusCode.js';\n\n/**\n * Create an instance of Axios\n *\n * @param {Object} defaultConfig The default config for the instance\n *\n * @returns {Axios} A new instance of Axios\n */\nfunction createInstance(defaultConfig) {\n  const context = new Axios(defaultConfig);\n  const instance = bind(Axios.prototype.request, context);\n\n  // Copy axios.prototype to instance\n  utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});\n\n  // Copy context to instance\n  utils.extend(instance, context, null, {allOwnKeys: true});\n\n  // Factory for creating new instances\n  instance.create = function create(instanceConfig) {\n    return createInstance(mergeConfig(defaultConfig, instanceConfig));\n  };\n\n  return instance;\n}\n\n// Create the default instance to be exported\nconst axios = createInstance(defaults);\n\n// Expose Axios class to allow class inheritance\naxios.Axios = Axios;\n\n// Expose Cancel & CancelToken\naxios.CanceledError = CanceledError;\naxios.CancelToken = CancelToken;\naxios.isCancel = isCancel;\naxios.VERSION = VERSION;\naxios.toFormData = toFormData;\n\n// Expose AxiosError class\naxios.AxiosError = AxiosError;\n\n// alias for CanceledError for backward compatibility\naxios.Cancel = axios.CanceledError;\n\n// Expose all/spread\naxios.all = function all(promises) {\n  return Promise.all(promises);\n};\n\naxios.spread = spread;\n\n// Expose isAxiosError\naxios.isAxiosError = isAxiosError;\n\n// Expose mergeConfig\naxios.mergeConfig = mergeConfig;\n\naxios.AxiosHeaders = AxiosHeaders;\n\naxios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);\n\naxios.getAdapter = adapters.getAdapter;\n\naxios.HttpStatusCode = HttpStatusCode;\n\naxios.default = axios;\n\n// this module should only have a default export\nexport default axios\n",
            "facade-axios-real/lib/core/Axios.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/core/Axios.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\n'use strict';\n\nimport utils from './../utils.js';\nimport buildURL from '../helpers/buildURL.js';\nimport InterceptorManager from './InterceptorManager.js';\nimport dispatchRequest from './dispatchRequest.js';\nimport mergeConfig from './mergeConfig.js';\nimport buildFullPath from './buildFullPath.js';\nimport validator from '../helpers/validator.js';\nimport AxiosHeaders from './AxiosHeaders.js';\n\nconst validators = validator.validators;\n\n/**\n * Create a new instance of Axios\n *\n * @param {Object} instanceConfig The default config for the instance\n *\n * @return {Axios} A new instance of Axios\n */\nclass Axios {\n  constructor(instanceConfig) {\n    this.defaults = instanceConfig;\n    this.interceptors = {\n      request: new InterceptorManager(),\n      response: new InterceptorManager()\n    };\n  }\n\n  /**\n   * Dispatch a request\n   *\n   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)\n   * @param {?Object} config\n   *\n   * @returns {Promise} The Promise to be fulfilled\n   */\n  async request(configOrUrl, config) {\n    try {\n      return await this._request(configOrUrl, config);\n    } catch (err) {\n      if (err instanceof Error) {\n        let dummy = {};\n\n        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());\n\n        // slice off the Error: ... line\n        const stack = dummy.stack ? dummy.stack.replace(/^.+\\n/, '') : '';\n        try {\n          if (!err.stack) {\n            err.stack = stack;\n            // match without the 2 top stack lines\n          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\\n.+\\n/, ''))) {\n            err.stack += '\\n' + stack\n          }\n        } catch (e) {\n          // ignore the case where \"stack\" is an un-writable property\n        }\n      }\n\n      throw err;\n    }\n  }\n\n  _request(configOrUrl, config) {\n    /*eslint no-param-reassign:0*/\n    // Allow for axios('example/url'[, config]) a la fetch API\n    if (typeof configOrUrl === 'string') {\n      config = config || {};\n      config.url = configOrUrl;\n    } else {\n      config = configOrUrl || {};\n    }\n\n    config = mergeConfig(this.defaults, config);\n\n    const {transitional, paramsSerializer, headers} = config;\n\n    // … trimmed: 25 lines validating transitional, paramsSerializer and option spelling, not related to the pattern …\n\n    // Set config.method\n    config.method = (config.method || this.defaults.method || 'get').toLowerCase();\n\n    // Flatten headers\n    let contextHeaders = headers && utils.merge(\n      headers.common,\n      headers[config.method]\n    );\n\n    headers && utils.forEach(\n      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],\n      (method) => {\n        delete headers[method];\n      }\n    );\n\n    config.headers = AxiosHeaders.concat(contextHeaders, headers);\n\n    // filter out skipped interceptors\n    const requestInterceptorChain = [];\n    let synchronousRequestInterceptors = true;\n    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {\n      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {\n        return;\n      }\n\n      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;\n\n      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);\n    });\n\n    const responseInterceptorChain = [];\n    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {\n      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);\n    });\n\n    let promise;\n    let i = 0;\n    let len;\n\n    if (!synchronousRequestInterceptors) {\n      const chain = [dispatchRequest.bind(this), undefined];\n      chain.unshift.apply(chain, requestInterceptorChain);\n      chain.push.apply(chain, responseInterceptorChain);\n      len = chain.length;\n\n      promise = Promise.resolve(config);\n\n      while (i < len) {\n        promise = promise.then(chain[i++], chain[i++]);\n      }\n\n      return promise;\n    }\n\n    len = requestInterceptorChain.length;\n\n    let newConfig = config;\n\n    i = 0;\n\n    while (i < len) {\n      const onFulfilled = requestInterceptorChain[i++];\n      const onRejected = requestInterceptorChain[i++];\n      try {\n        newConfig = onFulfilled(newConfig);\n      } catch (error) {\n        onRejected.call(this, error);\n        break;\n      }\n    }\n\n    try {\n      promise = dispatchRequest.call(this, newConfig);\n    } catch (error) {\n      return Promise.reject(error);\n    }\n\n    i = 0;\n    len = responseInterceptorChain.length;\n\n    while (i < len) {\n      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);\n    }\n\n    return promise;\n  }\n\n  getUri(config) {\n    config = mergeConfig(this.defaults, config);\n    const fullPath = buildFullPath(config.baseURL, config.url);\n    return buildURL(fullPath, config.params, config.paramsSerializer);\n  }\n}\n\n// Provide aliases for supported request methods\nutils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {\n  /*eslint func-names:0*/\n  Axios.prototype[method] = function(url, config) {\n    return this.request(mergeConfig(config || {}, {\n      method,\n      url,\n      data: (config || {}).data\n    }));\n  };\n});\n\nutils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {\n  /*eslint func-names:0*/\n\n  function generateHTTPMethod(isForm) {\n    return function httpMethod(url, data, config) {\n      return this.request(mergeConfig(config || {}, {\n        method,\n        headers: isForm ? {\n          'Content-Type': 'multipart/form-data'\n        } : {},\n        url,\n        data\n      }));\n    };\n  }\n\n  Axios.prototype[method] = generateHTTPMethod();\n\n  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);\n});\n\nexport default Axios;\n",
            "facade-axios-real/lib/core/dispatchRequest.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/core/dispatchRequest.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\n'use strict';\n\nimport transformData from './transformData.js';\nimport isCancel from '../cancel/isCancel.js';\nimport defaults from '../defaults/index.js';\nimport CanceledError from '../cancel/CanceledError.js';\nimport AxiosHeaders from '../core/AxiosHeaders.js';\nimport adapters from \"../adapters/adapters.js\";\n\n/**\n * Throws a `CanceledError` if cancellation has been requested.\n *\n * @param {Object} config The config that is to be used for the request\n *\n * @returns {void}\n */\nfunction throwIfCancellationRequested(config) {\n  if (config.cancelToken) {\n    config.cancelToken.throwIfRequested();\n  }\n\n  if (config.signal && config.signal.aborted) {\n    throw new CanceledError(null, config);\n  }\n}\n\n/**\n * Dispatch a request to the server using the configured adapter.\n *\n * @param {object} config The config that is to be used for the request\n *\n * @returns {Promise} The Promise to be fulfilled\n */\nexport default function dispatchRequest(config) {\n  throwIfCancellationRequested(config);\n\n  config.headers = AxiosHeaders.from(config.headers);\n\n  // Transform request data\n  config.data = transformData.call(\n    config,\n    config.transformRequest\n  );\n\n  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {\n    config.headers.setContentType('application/x-www-form-urlencoded', false);\n  }\n\n  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);\n\n  return adapter(config).then(function onAdapterResolution(response) {\n    throwIfCancellationRequested(config);\n\n    // Transform response data\n    response.data = transformData.call(\n      config,\n      config.transformResponse,\n      response\n    );\n\n    response.headers = AxiosHeaders.from(response.headers);\n\n    return response;\n  }, function onAdapterRejection(reason) {\n    if (!isCancel(reason)) {\n      throwIfCancellationRequested(config);\n\n      // Transform response data\n      if (reason && reason.response) {\n        reason.response.data = transformData.call(\n          config,\n          config.transformResponse,\n          reason.response\n        );\n        reason.response.headers = AxiosHeaders.from(reason.response.headers);\n      }\n    }\n\n    return Promise.reject(reason);\n  });\n}\n",
            "facade-axios-real/lib/helpers/bind.js": "/*\n * Source: axios v1.7.9 — https://github.com/axios/axios/blob/v1.7.9/lib/helpers/bind.js\n * MIT License, Copyright (c) 2014-present Matt Zabriskie & Collaborators. Included for study.\n */\n'use strict';\n\nexport default function bind(fn, thisArg) {\n  return function wrap() {\n    return fn.apply(thisArg, arguments);\n  };\n}\n",
            "facade-axios-real/usage.js": "// Example usage written for Software City (not part of axios).\n// Everything below goes through the single `axios` object: the facade.\nimport axios from './lib/axios.js';\n\nexport async function loadTodo() {\n  // Simplest call: one function, sensible defaults.\n  const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');\n  console.log(res.data.title);\n}\n\nexport async function useApiClient() {\n  // create() hands out another facade with its own defaults.\n  const api = axios.create({ baseURL: 'https://api.example.com', timeout: 3000 });\n  api.interceptors.request.use((config) => {\n    config.headers.Authorization = 'Bearer demo-token';\n    return config;\n  });\n  const res = await api.post('/notes', { text: 'facades hide subsystems' });\n  return res.status;\n}\n"
          }
        }
      ]
    },
    {
      "id": "proxy",
      "name": "Proxy",
      "family": "Structural",
      "aka": [
        "Surrogate",
        "Stand-in"
      ],
      "tagline": "A stand-in object that controls access to the real one behind the same interface.",
      "intent": "Put an object with the same interface in front of the real object so you can control how and when it is reached. The proxy can delay creating something expensive (virtual proxy), check permissions (protection proxy), cache results (caching proxy) or watch every change, while the client keeps using the normal interface.",
      "analogy": "A bank card is a proxy for the money in your account: shops treat it like cash, but the card checks your PIN and balance before anything moves.",
      "cityShape": "Look for a proxy building next to the real subject with matching floors at the same heights, since both implement one interface. Client pipes land only on the proxy; a single has link and a thinner pipe continue from the proxy to the real subject, sometimes only on the first call.",
      "roles": [
        {
          "name": "Subject",
          "desc": "The interface shared by the real object and its proxy."
        },
        {
          "name": "Real Subject",
          "desc": "The object that does the actual work and may be slow, remote or sensitive."
        },
        {
          "name": "Proxy",
          "desc": "Implements the Subject, holds or creates the Real Subject, and decides when to forward each call."
        },
        {
          "name": "Client",
          "desc": "Uses the Subject interface and cannot tell a proxy from the real thing."
        }
      ],
      "whenToUse": [
        "An object is expensive to create or load and many instances are never actually used (lazy loading).",
        "Calls need a guard in front of them: permissions, rate limits, input checks.",
        "Results are slow to compute and safe to reuse (caching), or you want to log or observe every access."
      ],
      "pitfalls": [
        "Hidden latency: a call that looks cheap may trigger a heavy load or network request the first time.",
        "Caching proxies serve stale data unless you design how entries expire.",
        "Identity checks get confusing: the proxy and the real object are different objects (proxy !== target)."
      ],
      "related": [
        "decorator",
        "adapter",
        "facade",
        "flyweight",
        "observer"
      ],
      "quiz": [
        {
          "q": "A Proxy and a Decorator both wrap an object with the same interface. What usually differs?",
          "options": [
            "A proxy controls access to its subject; a decorator adds new behaviour and is meant to be stacked",
            "A proxy changes the interface",
            "A decorator can never forward calls",
            "Only proxies can be used in JavaScript"
          ],
          "answer": 0,
          "why": "The code shape is similar, but the purpose differs: proxies manage access (lazy, guarded, cached, remote), decorators layer extra features."
        },
        {
          "q": "In the image gallery demo, when is the 20 MB file loaded?",
          "options": [
            "When the ImageProxy is constructed",
            "When name() is called",
            "The first time display() is called on that proxy",
            "When the program starts"
          ],
          "answer": 2,
          "why": "The proxy creates the HighResImage lazily inside display(), so thumbnails that are never opened cost nothing."
        }
      ],
      "demos": [
        {
          "id": "proxy-java-images",
          "title": "Lazy-loading photo gallery",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "A gallery lists three photos but only opens one. ImageProxy creates the heavy HighResImage on first display(), so the other two never touch the disk.",
          "roles": {
            "Subject": [
              "proxy-java-images/Image.java#Image"
            ],
            "Real Subject": [
              "proxy-java-images/HighResImage.java#HighResImage"
            ],
            "Proxy": [
              "proxy-java-images/ImageProxy.java#ImageProxy"
            ],
            "Client": [
              "proxy-java-images/Gallery.java#Gallery"
            ]
          },
          "trace": [
            {
              "at": "proxy-java-images/Gallery.java#Gallery.main",
              "say": "The gallery builds three proxies. Creating them is cheap: no file is read yet."
            },
            {
              "at": "proxy-java-images/ImageProxy.java#ImageProxy.name",
              "say": "Listing thumbnails only needs the name, which the proxy can answer by itself."
            },
            {
              "at": "proxy-java-images/ImageProxy.java#ImageProxy.display",
              "say": "The first display() finds no real image yet, so the proxy creates one now. This is the 'virtual proxy' idea."
            },
            {
              "at": "proxy-java-images/HighResImage.java#HighResImage.loadFromDisk",
              "say": "The expensive work happens once, and only for the photo the user actually opened."
            },
            {
              "at": "proxy-java-images/HighResImage.java#HighResImage.display",
              "say": "The proxy forwards display(). On the second call it skips loading and forwards straight away."
            }
          ],
          "files": {
            "proxy-java-images/Gallery.java": "import java.util.List;\n\n// The Client: builds a gallery of 3 photos but only opens one.\npublic class Gallery {\n    public static void main(String[] args) {\n        List<Image> photos = List.of(\n            new ImageProxy(\"beach.png\"),\n            new ImageProxy(\"mountain.png\"),\n            new ImageProxy(\"city.png\")\n        );\n        for (Image photo : photos) {\n            System.out.println(\"Thumbnail: \" + photo.name());\n        }\n        photos.get(1).display();\n        photos.get(1).display();\n    }\n}\n",
            "proxy-java-images/HighResImage.java": "// The Real Subject: expensive to create because it loads a big file.\npublic class HighResImage implements Image {\n    private final String fileName;\n    private byte[] pixels;\n\n    public HighResImage(String fileName) {\n        this.fileName = fileName;\n        loadFromDisk();\n    }\n\n    private void loadFromDisk() {\n        System.out.println(\"Loading \" + fileName + \" (20 MB)...\");\n        pixels = new byte[20_000_000];\n    }\n\n    public void display() {\n        System.out.println(\"Showing \" + fileName + \" (\" + pixels.length + \" bytes)\");\n    }\n\n    public String name() {\n        return fileName;\n    }\n}\n",
            "proxy-java-images/Image.java": "// The Subject: what the gallery works with.\npublic interface Image {\n    void display();\n    String name();\n}\n",
            "proxy-java-images/ImageProxy.java": "// The Proxy: same interface, but it creates the real image only when needed.\npublic class ImageProxy implements Image {\n    private final String fileName;\n    private HighResImage real;\n\n    public ImageProxy(String fileName) {\n        this.fileName = fileName;\n    }\n\n    public void display() {\n        if (real == null) {\n            real = new HighResImage(fileName);\n        }\n        real.display();\n    }\n\n    public String name() {\n        return fileName;\n    }\n}\n"
          }
        },
        {
          "id": "proxy-py-reports",
          "title": "Guarded, cached sales reports",
          "lang": "Python",
          "level": "intermediate",
          "source": null,
          "story": "A dashboard asks a ReportSource for monthly numbers. The proxy blocks users without the finance role and remembers each month, so the slow database query runs once.",
          "roles": {
            "Subject": [
              "proxy-py-reports/reports.py#ReportSource"
            ],
            "Real Subject": [
              "proxy-py-reports/reports.py#DatabaseReports"
            ],
            "Proxy": [
              "proxy-py-reports/proxy.py#GuardedReportsProxy"
            ],
            "Client": [
              "proxy-py-reports/app.py#show_dashboard",
              "proxy-py-reports/app.py#main"
            ]
          },
          "trace": [
            {
              "at": "proxy-py-reports/app.py#main",
              "say": "main() wraps the real database source in the proxy and hands that to the dashboard as a plain ReportSource."
            },
            {
              "at": "proxy-py-reports/app.py#show_dashboard",
              "say": "The dashboard calls fetch_report() and handles a PermissionError. It has no caching or role logic of its own."
            },
            {
              "at": "proxy-py-reports/proxy.py#GuardedReportsProxy.fetch_report",
              "say": "The proxy checks the user's roles first. Access control lives in one place, in front of the real object."
            },
            {
              "at": "proxy-py-reports/auth.py#can_view_reports",
              "say": "The permission rule is a small function the proxy reuses, so it can be tested on its own."
            },
            {
              "at": "proxy-py-reports/reports.py#DatabaseReports.fetch_report",
              "say": "On a cache miss the proxy forwards to the slow query and stores the result."
            },
            {
              "at": "proxy-py-reports/proxy.py#GuardedReportsProxy.fetch_report",
              "say": "Mia's second request is a cache hit; Tom is stopped before the database is touched at all."
            }
          ],
          "files": {
            "proxy-py-reports/app.py": "from .auth import User\nfrom .reports import DatabaseReports\nfrom .proxy import GuardedReportsProxy\n\n\n# The Client: written against ReportSource. Swap in the proxy and nothing here changes.\ndef show_dashboard(source, user: User, month: str) -> None:\n    try:\n        report = source.fetch_report(user, month)\n        print(f\"{user.name} sees {report['orders']} orders in {month}\")\n    except PermissionError as err:\n        print(f\"Access denied: {err}\")\n\n\ndef main() -> None:\n    source = GuardedReportsProxy(DatabaseReports())\n    mia = User(\"mia\", {\"finance\"})\n    tom = User(\"tom\", {\"support\"})\n    show_dashboard(source, mia, \"2026-09\")\n    show_dashboard(source, mia, \"2026-09\")\n    show_dashboard(source, tom, \"2026-09\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "proxy-py-reports/auth.py": "from dataclasses import dataclass, field\n\n\n@dataclass\nclass User:\n    name: str\n    roles: set = field(default_factory=set)\n\n\ndef can_view_reports(user: User) -> bool:\n    return \"finance\" in user.roles or \"admin\" in user.roles\n",
            "proxy-py-reports/proxy.py": "from .reports import ReportSource, DatabaseReports\nfrom .auth import can_view_reports\n\n\n# The Proxy: same interface as the real source, plus two guards in front of it.\n# 1) protection: only finance/admin users get through\n# 2) caching: each month is queried once\nclass GuardedReportsProxy(ReportSource):\n    def __init__(self, real: DatabaseReports):\n        self.real: DatabaseReports = real\n        self.cache = {}\n\n    def fetch_report(self, user, month: str) -> dict:\n        if not can_view_reports(user):\n            raise PermissionError(f\"{user.name} may not view reports\")\n        if month not in self.cache:\n            self.cache[month] = self.real.fetch_report(user, month)\n        else:\n            print(f\"  [proxy] cache hit for {month}\")\n        return self.cache[month]\n",
            "proxy-py-reports/reports.py": "import time\nfrom abc import ABC, abstractmethod\n\n\n# The Subject: anything that can produce a monthly sales report.\nclass ReportSource(ABC):\n    @abstractmethod\n    def fetch_report(self, user, month: str) -> dict:\n        ...\n\n\n# The Real Subject: runs a slow database query every time.\nclass DatabaseReports(ReportSource):\n    def fetch_report(self, user, month: str) -> dict:\n        print(f\"  [db] running heavy query for {month}...\")\n        time.sleep(1.5)\n        return {\"month\": month, \"revenue\": 18250, \"orders\": 412}\n"
          }
        },
        {
          "id": "proxy-onchange-real",
          "title": "on-change: watching objects with a JavaScript Proxy",
          "lang": "JavaScript",
          "level": "advanced",
          "source": {
            "repo": "sindresorhus/on-change",
            "url": "https://github.com/sindresorhus/on-change/blob/v4.0.2/index.js",
            "license": "MIT",
            "note": "index.js (one marked trim: the apply() trap) and lib/cache.js are verbatim from on-change v4.0.2. Other lib/ helpers are not included. usage.js was written for Software City."
          },
          "story": "on-change returns a built-in JavaScript Proxy around your object. Its get/set/deleteProperty traps forward every operation to the real object and report each change, while your code keeps using normal property syntax.",
          "roles": {
            "Real Subject": [
              "proxy-onchange-real/usage.js#cart"
            ],
            "Proxy": [
              "proxy-onchange-real/index.js#onChange",
              "proxy-onchange-real/lib/cache.js#Cache"
            ],
            "Client": [
              "proxy-onchange-real/usage.js#run"
            ]
          },
          "trace": [
            {
              "at": "proxy-onchange-real/usage.js#run",
              "say": "run() wraps the cart and from then on only talks to watchedCart, using normal assignments and push()."
            },
            {
              "at": "proxy-onchange-real/index.js#onChange",
              "say": "onChange() builds a handler object full of traps and asks the cache for a Proxy around the target."
            },
            {
              "at": "proxy-onchange-real/lib/cache.js#Cache.getProxy",
              "say": "getProxy() creates new Proxy(target, handler) once per object and remembers it in a WeakMap, plus the object's path."
            },
            {
              "at": "proxy-onchange-real/index.js#set",
              "say": "Assigning coupon hits the set trap. It skips equal values, forwards the write to the real object, then reports the change."
            },
            {
              "at": "proxy-onchange-real/index.js#get",
              "say": "Reading items hits the get trap, which returns another proxy for the nested array, so the push inside it is watched too."
            },
            {
              "at": "proxy-onchange-real/index.js#deleteProperty",
              "say": "delete is trapped as well. Every way of touching the object goes through the stand-in first."
            },
            {
              "at": "proxy-onchange-real/usage.js#saveDraft",
              "say": "The callback receives the path, new and previous value. The real cart object was changed, but only through the proxy."
            }
          ],
          "files": {
            "proxy-onchange-real/index.js": "/*\n * Source: on-change v4.0.2 — https://github.com/sindresorhus/on-change/blob/v4.0.2/index.js\n * MIT License, Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com). Included for study.\n */\n/* eslint-disable unicorn/prefer-spread */\nimport {TARGET, UNSUBSCRIBE} from './lib/constants.js';\nimport {isBuiltinWithMutableMethods, isBuiltinWithoutMutableMethods} from './lib/is-builtin.js';\nimport path from './lib/path.js';\nimport isSymbol from './lib/is-symbol.js';\nimport isIterator from './lib/is-iterator.js';\nimport wrapIterator from './lib/wrap-iterator.js';\nimport ignoreProperty from './lib/ignore-property.js';\nimport Cache from './lib/cache.js';\nimport SmartClone from './lib/smart-clone/smart-clone.js';\n\nconst defaultOptions = {\n\tequals: Object.is,\n\tisShallow: false,\n\tpathAsArray: false,\n\tignoreSymbols: false,\n\tignoreUnderscores: false,\n\tignoreDetached: false,\n\tdetails: false,\n};\n\nconst onChange = (object, onChange, options = {}) => {\n\toptions = {\n\t\t...defaultOptions,\n\t\t...options,\n\t};\n\n\tconst proxyTarget = Symbol('ProxyTarget');\n\tconst {equals, isShallow, ignoreDetached, details} = options;\n\tconst cache = new Cache(equals);\n\tconst hasOnValidate = typeof options.onValidate === 'function';\n\tconst smartClone = new SmartClone(hasOnValidate);\n\n\t// eslint-disable-next-line max-params\n\tconst validate = (target, property, value, previous, applyData) => !hasOnValidate\n\t\t|| smartClone.isCloning\n\t\t|| options.onValidate(path.concat(cache.getPath(target), property), value, previous, applyData) === true;\n\n\tconst handleChangeOnTarget = (target, property, value, previous) => {\n\t\tif (\n\t\t\t!ignoreProperty(cache, options, property)\n\t\t\t&& !(ignoreDetached && cache.isDetached(target, object))\n\t\t) {\n\t\t\thandleChange(cache.getPath(target), property, value, previous);\n\t\t}\n\t};\n\n\t// eslint-disable-next-line max-params\n\tconst handleChange = (changePath, property, value, previous, applyData) => {\n\t\tif (smartClone.isCloning) {\n\t\t\tsmartClone.update(changePath, property, previous);\n\t\t} else {\n\t\t\tonChange(path.concat(changePath, property), value, previous, applyData);\n\t\t}\n\t};\n\n\tconst getProxyTarget = value => value\n\t\t? (value[proxyTarget] || value)\n\t\t: value;\n\n\tconst prepareValue = (value, target, property, basePath) => {\n\t\tif (\n\t\t\tisBuiltinWithoutMutableMethods(value)\n\t\t\t|| property === 'constructor'\n\t\t\t|| (isShallow && !SmartClone.isHandledMethod(target, property))\n\t\t\t|| ignoreProperty(cache, options, property)\n\t\t\t|| cache.isGetInvariant(target, property)\n\t\t\t|| (ignoreDetached && cache.isDetached(target, object))\n\t\t) {\n\t\t\treturn value;\n\t\t}\n\n\t\tif (basePath === undefined) {\n\t\t\tbasePath = cache.getPath(target);\n\t\t}\n\n\t\treturn cache.getProxy(value, path.concat(basePath, property), handler, proxyTarget);\n\t};\n\n\tconst handler = {\n\t\tget(target, property, receiver) {\n\t\t\tif (isSymbol(property)) {\n\t\t\t\tif (property === proxyTarget || property === TARGET) {\n\t\t\t\t\treturn target;\n\t\t\t\t}\n\n\t\t\t\tif (\n\t\t\t\t\tproperty === UNSUBSCRIBE\n\t\t\t\t\t&& !cache.isUnsubscribed\n\t\t\t\t\t&& cache.getPath(target).length === 0\n\t\t\t\t) {\n\t\t\t\t\tcache.unsubscribe();\n\t\t\t\t\treturn target;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tconst value = isBuiltinWithMutableMethods(target)\n\t\t\t\t? Reflect.get(target, property)\n\t\t\t\t: Reflect.get(target, property, receiver);\n\n\t\t\treturn prepareValue(value, target, property);\n\t\t},\n\n\t\tset(target, property, value, receiver) {\n\t\t\tvalue = getProxyTarget(value);\n\n\t\t\tconst reflectTarget = target[proxyTarget] || target;\n\t\t\tconst previous = reflectTarget[property];\n\n\t\t\tif (equals(previous, value) && property in target) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\tconst isValid = validate(target, property, value, previous);\n\n\t\t\tif (\n\t\t\t\tisValid\n\t\t\t\t&& cache.setProperty(reflectTarget, property, value, receiver, previous)\n\t\t\t) {\n\t\t\t\thandleChangeOnTarget(target, property, target[property], previous);\n\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\treturn !isValid;\n\t\t},\n\n\t\tdefineProperty(target, property, descriptor) {\n\t\t\tif (!cache.isSameDescriptor(descriptor, target, property)) {\n\t\t\t\tconst previous = target[property];\n\n\t\t\t\tif (\n\t\t\t\t\tvalidate(target, property, descriptor.value, previous)\n\t\t\t\t\t&& cache.defineProperty(target, property, descriptor, previous)\n\t\t\t\t) {\n\t\t\t\t\thandleChangeOnTarget(target, property, descriptor.value, previous);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn true;\n\t\t},\n\n\t\tdeleteProperty(target, property) {\n\t\t\tif (!Reflect.has(target, property)) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\tconst previous = Reflect.get(target, property);\n\t\t\tconst isValid = validate(target, property, undefined, previous);\n\n\t\t\tif (\n\t\t\t\tisValid\n\t\t\t\t&& cache.deleteProperty(target, property, previous)\n\t\t\t) {\n\t\t\t\thandleChangeOnTarget(target, property, undefined, previous);\n\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\treturn !isValid;\n\t\t},\n\n\t\t// … trimmed: 67-line apply() trap that clones Map/Set/Array/Date before mutating methods run, to report their changes …\n\t};\n\n\tconst proxy = cache.getProxy(object, options.pathAsArray ? [] : '', handler);\n\tonChange = onChange.bind(proxy);\n\n\tif (hasOnValidate) {\n\t\toptions.onValidate = options.onValidate.bind(proxy);\n\t}\n\n\treturn proxy;\n};\n\nonChange.target = proxy => (proxy && proxy[TARGET]) || proxy;\nonChange.unsubscribe = proxy => proxy[UNSUBSCRIBE] || proxy;\n\nexport default onChange;\n",
            "proxy-onchange-real/lib/cache.js": "/*\n * Source: on-change v4.0.2 — https://github.com/sindresorhus/on-change/blob/v4.0.2/lib/cache.js\n * MIT License, Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com). Included for study.\n */\nimport path from './path.js';\n\n/**\n@class Cache\n@private\n*/\nexport default class Cache {\n\tconstructor(equals) {\n\t\tthis._equals = equals;\n\t\tthis._proxyCache = new WeakMap();\n\t\tthis._pathCache = new WeakMap();\n\t\tthis.isUnsubscribed = false;\n\t}\n\n\t_getDescriptorCache() {\n\t\tif (this._descriptorCache === undefined) {\n\t\t\tthis._descriptorCache = new WeakMap();\n\t\t}\n\n\t\treturn this._descriptorCache;\n\t}\n\n\t_getProperties(target) {\n\t\tconst descriptorCache = this._getDescriptorCache();\n\t\tlet properties = descriptorCache.get(target);\n\n\t\tif (properties === undefined) {\n\t\t\tproperties = {};\n\t\t\tdescriptorCache.set(target, properties);\n\t\t}\n\n\t\treturn properties;\n\t}\n\n\t_getOwnPropertyDescriptor(target, property) {\n\t\tif (this.isUnsubscribed) {\n\t\t\treturn Reflect.getOwnPropertyDescriptor(target, property);\n\t\t}\n\n\t\tconst properties = this._getProperties(target);\n\t\tlet descriptor = properties[property];\n\n\t\tif (descriptor === undefined) {\n\t\t\tdescriptor = Reflect.getOwnPropertyDescriptor(target, property);\n\t\t\tproperties[property] = descriptor;\n\t\t}\n\n\t\treturn descriptor;\n\t}\n\n\tgetProxy(target, path, handler, proxyTarget) {\n\t\tif (this.isUnsubscribed) {\n\t\t\treturn target;\n\t\t}\n\n\t\tconst reflectTarget = target[proxyTarget];\n\t\tconst source = reflectTarget || target;\n\n\t\tthis._pathCache.set(source, path);\n\n\t\tlet proxy = this._proxyCache.get(source);\n\n\t\tif (proxy === undefined) {\n\t\t\tproxy = reflectTarget === undefined\n\t\t\t\t? new Proxy(target, handler)\n\t\t\t\t: target;\n\n\t\t\tthis._proxyCache.set(source, proxy);\n\t\t}\n\n\t\treturn proxy;\n\t}\n\n\tgetPath(target) {\n\t\treturn this.isUnsubscribed ? undefined : this._pathCache.get(target);\n\t}\n\n\tisDetached(target, object) {\n\t\treturn !Object.is(target, path.get(object, this.getPath(target)));\n\t}\n\n\tdefineProperty(target, property, descriptor) {\n\t\tif (!Reflect.defineProperty(target, property, descriptor)) {\n\t\t\treturn false;\n\t\t}\n\n\t\tif (!this.isUnsubscribed) {\n\t\t\tthis._getProperties(target)[property] = descriptor;\n\t\t}\n\n\t\treturn true;\n\t}\n\n\tsetProperty(target, property, value, receiver, previous) { // eslint-disable-line max-params\n\t\tif (!this._equals(previous, value) || !(property in target)) {\n\t\t\tconst descriptor = this._getOwnPropertyDescriptor(target, property);\n\n\t\t\tif (descriptor !== undefined && 'set' in descriptor) {\n\t\t\t\treturn Reflect.set(target, property, value, receiver);\n\t\t\t}\n\n\t\t\treturn Reflect.set(target, property, value);\n\t\t}\n\n\t\treturn true;\n\t}\n\n\tdeleteProperty(target, property, previous) {\n\t\tif (Reflect.deleteProperty(target, property)) {\n\t\t\tif (!this.isUnsubscribed) {\n\t\t\t\tconst properties = this._getDescriptorCache().get(target);\n\n\t\t\t\tif (properties) {\n\t\t\t\t\tdelete properties[property];\n\t\t\t\t\tthis._pathCache.delete(previous);\n\t\t\t\t}\n\t\t\t}\n\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tisSameDescriptor(a, target, property) {\n\t\tconst b = this._getOwnPropertyDescriptor(target, property);\n\n\t\treturn a !== undefined\n\t\t\t&& b !== undefined\n\t\t\t&& Object.is(a.value, b.value)\n\t\t\t&& (a.writable || false) === (b.writable || false)\n\t\t\t&& (a.enumerable || false) === (b.enumerable || false)\n\t\t\t&& (a.configurable || false) === (b.configurable || false)\n\t\t\t&& a.get === b.get\n\t\t\t&& a.set === b.set;\n\t}\n\n\tisGetInvariant(target, property) {\n\t\tconst descriptor = this._getOwnPropertyDescriptor(target, property);\n\n\t\treturn descriptor !== undefined\n\t\t\t&& descriptor.configurable !== true\n\t\t\t&& descriptor.writable !== true;\n\t}\n\n\tunsubscribe() {\n\t\tthis._descriptorCache = null;\n\t\tthis._pathCache = null;\n\t\tthis._proxyCache = null;\n\t\tthis.isUnsubscribed = true;\n\t}\n}\n",
            "proxy-onchange-real/usage.js": "// Example usage written for Software City (not part of on-change).\n// The cart object is wrapped in a JavaScript Proxy; the shop code keeps\n// using it like a plain object while every change is reported.\nimport onChange from './index.js';\n\nconst cart = {items: [], coupon: null};\n\nexport function saveDraft(path, value, previous) {\n\tconsole.log(`changed ${path}:`, previous, '->', value);\n}\n\nexport function run() {\n\tconst watchedCart = onChange(cart, saveDraft);\n\twatchedCart.coupon = 'AUTUMN10';\n\twatchedCart.items.push({sku: 'mug', qty: 1});\n\tdelete watchedCart.coupon;\n\tconsole.log(onChange.target(watchedCart) === cart);\n}\n"
          }
        }
      ]
    },
    {
      "id": "composite",
      "name": "Composite",
      "family": "Structural",
      "aka": [
        "Object tree",
        "Part-whole hierarchy"
      ],
      "tagline": "Treat a single item and a whole group of items through the same interface.",
      "intent": "Build tree structures where a group (composite) and a single item (leaf) share one interface. A group answers a request by asking each of its children, which may be leaves or further groups, so client code works on any part of the tree with one call and never checks what kind of node it has.",
      "analogy": "An army's chain of command: an order given to a division is passed to its brigades, then battalions, then soldiers. The general does not care how deep it goes; each level knows to pass it down.",
      "cityShape": "Look for a leaf building and a composite building with floors at the same heights (size, price, render, validate). The composite's floors have a call pipe that loops back into the same interface, often to itself, and its roof carries a children list antenna that add() writes into.",
      "roles": [
        {
          "name": "Component",
          "desc": "The shared interface for single items and groups."
        },
        {
          "name": "Leaf",
          "desc": "An item with no children that does the real work itself."
        },
        {
          "name": "Composite",
          "desc": "Holds child Components and implements each operation by delegating to its children and combining the results."
        },
        {
          "name": "Client",
          "desc": "Builds the tree and calls operations on any node, usually the root."
        }
      ],
      "whenToUse": [
        "Your data is naturally a tree: folders, menus, UI layouts, scene graphs, org charts, bundles of products.",
        "You want the same operation (total, render, validate, damage) to work on one item or a whole group.",
        "Clients should not need if/else checks for 'is this a group or a single thing?'."
      ],
      "pitfalls": [
        "Leaf-only or group-only methods (add on a leaf) force awkward choices: throw, ignore, or split the interface.",
        "Very deep or cyclic trees cause slow or infinite recursion; guard against a node containing itself.",
        "Recomputing totals on every call can get slow for big trees; cache carefully and invalidate on change."
      ],
      "related": [
        "decorator",
        "iterator",
        "visitor",
        "flyweight",
        "chain-of-responsibility"
      ],
      "quiz": [
        {
          "q": "Why does Folder.size() not need to know whether a child is a File or another Folder?",
          "options": [
            "Both implement the same Component interface, so it just calls child.size()",
            "Folders store sizes in a global table",
            "TypeScript checks the type at runtime",
            "Because files cannot be inside folders"
          ],
          "answer": 0,
          "why": "The shared interface is the whole trick: the composite asks every child the same question and lets recursion handle nested groups."
        },
        {
          "q": "In the shop demo, a bundle contains another bundle. How is the inner discount applied?",
          "options": [
            "The cart applies all discounts at the end",
            "The inner bundle's price() applies its own discount before the outer bundle adds it up",
            "Only the outermost discount counts",
            "Discounts are ignored for nested bundles"
          ],
          "answer": 1,
          "why": "Each composite computes its own result from its children. The outer bundle simply receives an already-discounted price from the inner one."
        }
      ],
      "demos": [
        {
          "id": "composite-ts-files",
          "title": "Folder sizes",
          "lang": "TypeScript",
          "level": "beginner",
          "source": null,
          "story": "Files and folders both have size() and printTree(). A folder's size is the sum of its children's sizes, and some of those children are folders too.",
          "roles": {
            "Component": [
              "composite-ts-files/item.ts#FileSystemItem"
            ],
            "Leaf": [
              "composite-ts-files/file.ts#File"
            ],
            "Composite": [
              "composite-ts-files/folder.ts#Folder"
            ],
            "Client": [
              "composite-ts-files/main.ts#main"
            ]
          },
          "trace": [
            {
              "at": "composite-ts-files/main.ts#main",
              "say": "main() builds a small tree: a project folder with a text file and a photos folder inside."
            },
            {
              "at": "composite-ts-files/folder.ts#Folder.add",
              "say": "add() accepts any FileSystemItem, so files and folders go into the same children list."
            },
            {
              "at": "composite-ts-files/folder.ts#Folder.printTree",
              "say": "printTree() writes its own line, then asks each child to print itself one level deeper."
            },
            {
              "at": "composite-ts-files/folder.ts#Folder.size",
              "say": "size() sums child.size() for every child. For the nested photos folder, this same method runs again."
            },
            {
              "at": "composite-ts-files/file.ts#File.size",
              "say": "A leaf just returns its own number. Recursion stops here."
            },
            {
              "at": "composite-ts-files/file.ts#File.printTree",
              "say": "Leaves print one line. The client got a full indented tree from a single call on the root."
            }
          ],
          "files": {
            "composite-ts-files/file.ts": "import { FileSystemItem } from './item';\n\n// The Leaf: has a size of its own and no children.\nexport class File implements FileSystemItem {\n  name: string;\n  private bytes: number;\n\n  constructor(name: string, bytes: number) {\n    this.name = name;\n    this.bytes = bytes;\n  }\n\n  size(): number {\n    return this.bytes;\n  }\n\n  printTree(indent: string): void {\n    console.log(`${indent}${this.name} (${this.size()} B)`);\n  }\n}\n",
            "composite-ts-files/folder.ts": "import { FileSystemItem } from './item';\n\n// The Composite: holds children that may be files OR other folders.\nexport class Folder implements FileSystemItem {\n  name: string;\n  private children: FileSystemItem[] = [];\n\n  constructor(name: string) {\n    this.name = name;\n  }\n\n  add(item: FileSystemItem): Folder {\n    this.children.push(item);\n    return this;\n  }\n\n  // Ask every child, whatever it is, and add up the answers.\n  size(): number {\n    return this.children.reduce((total, child) => total + child.size(), 0);\n  }\n\n  printTree(indent: string): void {\n    console.log(`${indent}${this.name}/ (${this.size()} B)`);\n    for (const child of this.children) {\n      child.printTree(indent + '  ');\n    }\n  }\n}\n",
            "composite-ts-files/item.ts": "// The Component: files and folders both answer these two questions.\nexport interface FileSystemItem {\n  name: string;\n  size(): number;\n  printTree(indent: string): void;\n}\n",
            "composite-ts-files/main.ts": "import { File } from './file';\nimport { Folder } from './folder';\n\nfunction main(): void {\n  const photos = new Folder('photos')\n    .add(new File('beach.jpg', 2400))\n    .add(new File('cat.jpg', 1800));\n  const project = new Folder('project')\n    .add(new File('notes.txt', 120))\n    .add(photos);\n\n  // One call on the root walks the whole tree.\n  project.printTree('');\n  console.log('Total:', project.size(), 'bytes');\n}\n\nmain();\n"
          }
        },
        {
          "id": "composite-kt-bundles",
          "title": "Product bundles in a web shop",
          "lang": "Kotlin",
          "level": "intermediate",
          "source": null,
          "story": "A bundle can hold products and smaller bundles, each with its own discount. The cart computes price, shipping weight and the receipt without ever asking 'is this a bundle?'.",
          "roles": {
            "Component": [
              "composite-kt-bundles/CatalogItem.kt#CatalogItem"
            ],
            "Leaf": [
              "composite-kt-bundles/Product.kt#Product"
            ],
            "Composite": [
              "composite-kt-bundles/Bundle.kt#Bundle"
            ],
            "Client": [
              "composite-kt-bundles/Cart.kt#Cart",
              "composite-kt-bundles/Main.kt#main"
            ]
          },
          "trace": [
            {
              "at": "composite-kt-bundles/Main.kt#main",
              "say": "main() nests a starter kit bundle inside a deluxe bundle, then puts the deluxe bundle and a single gift card in the cart."
            },
            {
              "at": "composite-kt-bundles/Cart.kt#Cart.printReceipt",
              "say": "The cart loops over its lines and calls describe(). Bundles and products look identical from here."
            },
            {
              "at": "composite-kt-bundles/Bundle.kt#Bundle.describe",
              "say": "A bundle prints its header and then flattens its children's descriptions one level deeper."
            },
            {
              "at": "composite-kt-bundles/Cart.kt#Cart.total",
              "say": "total() sums price() over the lines, then adds shipping."
            },
            {
              "at": "composite-kt-bundles/Bundle.kt#Bundle.price",
              "say": "The deluxe bundle sums its children, including the starter kit, whose own price() already applied 10% off. Then it applies its 5%."
            },
            {
              "at": "composite-kt-bundles/Product.kt#Product.price",
              "say": "Leaves just return their shelf price."
            },
            {
              "at": "composite-kt-bundles/Bundle.kt#Bundle.weightGrams",
              "say": "Shipping weight uses the same recursion. Adding a new operation means one method per class, no type checks."
            }
          ],
          "files": {
            "composite-kt-bundles/Bundle.kt": "package shop\n\n// The Composite: a bundle of products and/or smaller bundles, with its own discount.\nclass Bundle(override val name: String, private val discountPercent: Int) : CatalogItem {\n    private val items = mutableListOf<CatalogItem>()\n\n    fun add(vararg children: CatalogItem): Bundle {\n        items.addAll(children)\n        return this\n    }\n\n    // Recursion does the work: a child bundle computes its own discounted price.\n    override fun price(): Double {\n        val sum = items.sumOf { it.price() }\n        return sum * (100 - discountPercent) / 100.0\n    }\n\n    override fun weightGrams(): Int {\n        return items.sumOf { it.weightGrams() }\n    }\n\n    override fun describe(depth: Int): List<String> {\n        val header = \"  \".repeat(depth) + \"$name (-$discountPercent%)  %.2f\".format(price())\n        return listOf(header) + items.flatMap { it.describe(depth + 1) }\n    }\n}\n",
            "composite-kt-bundles/Cart.kt": "package shop\n\n// The Client: the cart treats products and bundles exactly the same way.\nclass Cart {\n    private val lines = mutableListOf<CatalogItem>()\n\n    fun add(item: CatalogItem) {\n        lines.add(item)\n    }\n\n    fun total(): Double {\n        return lines.sumOf { it.price() } + shipping()\n    }\n\n    fun shipping(): Double {\n        val kg = lines.sumOf { it.weightGrams() } / 1000.0\n        return if (kg > 5) 9.90 else 4.90\n    }\n\n    fun printReceipt() {\n        lines.flatMap { it.describe(0) }.forEach { println(it) }\n        println(\"Shipping %.2f, total %.2f\".format(shipping(), total()))\n    }\n}\n",
            "composite-kt-bundles/CatalogItem.kt": "package shop\n\n// The Component: a single product and a whole bundle answer the same questions.\ninterface CatalogItem {\n    val name: String\n    fun price(): Double\n    fun weightGrams(): Int\n    fun describe(depth: Int): List<String>\n}\n",
            "composite-kt-bundles/Main.kt": "package shop\n\nfun main() {\n    val starter = Bundle(\"Gamer starter kit\", 10).add(\n        Product(\"Controller\", 59.0, 280),\n        Product(\"Headset\", 79.0, 350)\n    )\n    val deluxe = Bundle(\"Deluxe edition\", 5).add(\n        Product(\"Console\", 449.0, 3900),\n        starter\n    )\n\n    val cart = Cart()\n    cart.add(deluxe)\n    cart.add(Product(\"Gift card\", 25.0, 5))\n    cart.printReceipt()\n}\n",
            "composite-kt-bundles/Product.kt": "package shop\n\n// The Leaf: a real thing on a shelf with its own price and weight.\nclass Product(override val name: String, private val unitPrice: Double, private val grams: Int) : CatalogItem {\n\n    override fun price(): Double {\n        return unitPrice\n    }\n\n    override fun weightGrams(): Int {\n        return grams\n    }\n\n    override fun describe(depth: Int): List<String> {\n        return listOf(\"  \".repeat(depth) + \"$name  %.2f\".format(price()))\n    }\n}\n"
          }
        },
        {
          "id": "composite-php-forms",
          "title": "Nested form builder with validation",
          "lang": "PHP",
          "level": "advanced",
          "source": null,
          "story": "A signup form is a tree of fieldsets and fields. Rendering and validation both run recursively, and the Form root is itself just a special Fieldset.",
          "roles": {
            "Component": [
              "composite-php-forms/FormElement.php#FormElement"
            ],
            "Leaf": [
              "composite-php-forms/Fields.php#TextField",
              "composite-php-forms/Fields.php#EmailField"
            ],
            "Composite": [
              "composite-php-forms/Fieldset.php#Fieldset",
              "composite-php-forms/Form.php#Form"
            ],
            "Client": [
              "composite-php-forms/signup.php#buildSignupForm",
              "composite-php-forms/signup.php#handleSignup"
            ]
          },
          "trace": [
            {
              "at": "composite-php-forms/signup.php#buildSignupForm",
              "say": "The client builds a three-level tree: the form holds Account and Profile, and Profile holds an Address fieldset."
            },
            {
              "at": "composite-php-forms/signup.php#handleSignup",
              "say": "Handling a post is one call on the root. The client never walks the tree itself."
            },
            {
              "at": "composite-php-forms/Form.php#Form.handle",
              "say": "The root composite runs validate() on itself, inherited from Fieldset, and wraps the result."
            },
            {
              "at": "composite-php-forms/Fieldset.php#Fieldset.validate",
              "say": "A fieldset merges the errors of all its children. A child fieldset runs this same method on its own subtree."
            },
            {
              "at": "composite-php-forms/Fields.php#EmailField.validate",
              "say": "Leaves hold the real rules. EmailField reuses TextField's required check, then adds a format check."
            },
            {
              "at": "composite-php-forms/Fields.php#TextField.validate",
              "say": "A required field with no value returns one error keyed by field name; errors bubble up through every fieldset."
            },
            {
              "at": "composite-php-forms/Form.php#Form.render",
              "say": "Rendering mirrors validation: the root wraps its children's HTML, and each fieldset does the same for its own children."
            }
          ],
          "files": {
            "composite-php-forms/Fields.php": "<?php\nrequire_once __DIR__ . '/FormElement.php';\n\n// Leaves: single inputs. They know their own rules and nothing about nesting.\nclass TextField implements FormElement\n{\n    public function __construct(\n        protected string $name,\n        protected string $label,\n        protected bool $required = false,\n    ) {\n    }\n\n    public function render(): string\n    {\n        $req = $this->required ? ' required' : '';\n        return \"<label>{$this->label} <input name=\\\"{$this->name}\\\"{$req}></label>\";\n    }\n\n    public function validate(array $input): array\n    {\n        $value = trim($input[$this->name] ?? '');\n        if ($this->required && $value === '') {\n            return [$this->name => \"{$this->label} is required\"];\n        }\n        return [];\n    }\n}\n\nclass EmailField extends TextField\n{\n    public function validate(array $input): array\n    {\n        $errors = parent::validate($input);\n        $value = $input[$this->name] ?? '';\n        if (!$errors && $value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {\n            $errors[$this->name] = \"{$this->label} must be a valid e-mail address\";\n        }\n        return $errors;\n    }\n}\n",
            "composite-php-forms/Fieldset.php": "<?php\nrequire_once __DIR__ . '/FormElement.php';\n\n// The Composite: a group of elements, which may themselves be groups.\nclass Fieldset implements FormElement\n{\n    /** @var FormElement[] */\n    protected array $children = [];\n\n    public function __construct(protected string $legend)\n    {\n    }\n\n    public function add(FormElement ...$elements): static\n    {\n        foreach ($elements as $element) {\n            $this->children[] = $element;\n        }\n        return $this;\n    }\n\n    public function render(): string\n    {\n        $inner = implode(\"\\n\", array_map(fn (FormElement $e) => $e->render(), $this->children));\n        return \"<fieldset><legend>{$this->legend}</legend>\\n{$inner}\\n</fieldset>\";\n    }\n\n    // Collect errors from the whole subtree with one recursive call per child.\n    public function validate(array $input): array\n    {\n        $errors = [];\n        foreach ($this->children as $child) {\n            $errors = array_merge($errors, $child->validate($input));\n        }\n        return $errors;\n    }\n}\n",
            "composite-php-forms/Form.php": "<?php\nrequire_once __DIR__ . '/Fieldset.php';\n\n// The root of the tree is just a special Fieldset that adds a <form> tag and a submit button.\nclass Form extends Fieldset\n{\n    public function __construct(private string $action)\n    {\n        parent::__construct('');\n    }\n\n    public function render(): string\n    {\n        $inner = implode(\"\\n\", array_map(fn (FormElement $e) => $e->render(), $this->children));\n        return \"<form method=\\\"post\\\" action=\\\"{$this->action}\\\">\\n{$inner}\\n<button>Send</button>\\n</form>\";\n    }\n\n    public function handle(array $post): array\n    {\n        $errors = $this->validate($post);\n        return ['ok' => !$errors, 'errors' => $errors];\n    }\n}\n",
            "composite-php-forms/FormElement.php": "<?php\n// The Component: every piece of a form can render itself and validate input.\ninterface FormElement\n{\n    public function render(): string;\n\n    /** @return array<string, string> field name => error message */\n    public function validate(array $input): array;\n}\n",
            "composite-php-forms/signup.php": "<?php\nrequire_once __DIR__ . '/Form.php';\nrequire_once __DIR__ . '/Fields.php';\n\n// The Client: builds the tree once, then talks only to the root.\nfunction buildSignupForm(): Form\n{\n    $account = (new Fieldset('Account'))->add(\n        new EmailField('email', 'E-mail', true),\n        new TextField('password', 'Password', true),\n    );\n    $address = (new Fieldset('Address'))->add(\n        new TextField('street', 'Street'),\n        new TextField('city', 'City', true),\n    );\n    $profile = (new Fieldset('Profile'))->add(\n        new TextField('nickname', 'Nickname'),\n        $address,\n    );\n    return (new Form('/signup'))->add($account, $profile);\n}\n\nfunction handleSignup(array $post): void\n{\n    $form = buildSignupForm();\n    $result = $form->handle($post);\n    if ($result['ok']) {\n        echo \"Welcome aboard!\\n\";\n        return;\n    }\n    echo $form->render() . \"\\n\";\n    foreach ($result['errors'] as $field => $message) {\n        echo \"- {$field}: {$message}\\n\";\n    }\n}\n\nhandleSignup(['email' => 'not-an-email', 'password' => 'secret']);\n"
          }
        }
      ]
    },
    {
      "id": "bridge",
      "name": "Bridge",
      "family": "Structural",
      "aka": [
        "Handle / Body"
      ],
      "tagline": "Split one big hierarchy into two that vary independently, joined by a reference.",
      "intent": "When a class varies in two directions (what it does and how it does it), subclassing every combination explodes: TvRemote, RadioRemote, AdvancedTvRemote... Bridge splits the two directions into separate hierarchies, an abstraction and an implementor, and lets the abstraction hold a reference to an implementor. Both sides grow on their own and any pair can be combined at runtime.",
      "analogy": "Light switches and lamps: any switch (toggle, dimmer, smart switch) can drive any lamp (bulb, LED strip, ceiling fan light) because they meet at a standard wire. Nobody builds a separate 'dimmer-for-LED-strip' product.",
      "cityShape": "Look for two separate groups of buildings: the abstraction side (remotes, weapons, notifications) and the implementor side (devices, elements, senders). Exactly one kind of has link spans the gap, the bridge, and call pipes from the abstraction's floors cross it to same-height floors on every implementor.",
      "roles": [
        {
          "name": "Abstraction",
          "desc": "The high-level side the client uses; holds a reference to an Implementor."
        },
        {
          "name": "Refined Abstraction",
          "desc": "A variant of the abstraction with extra or different high-level behaviour."
        },
        {
          "name": "Implementor",
          "desc": "The interface for the low-level work the abstraction delegates."
        },
        {
          "name": "Concrete Implementor",
          "desc": "One platform-, device- or channel-specific way of doing that low-level work."
        },
        {
          "name": "Client",
          "desc": "Picks an abstraction and an implementor and connects them."
        }
      ],
      "whenToUse": [
        "A class would need a subclass for every combination of two independent choices (shape x renderer, weapon x element, message x channel).",
        "You want to switch the implementation at runtime, such as changing a weapon's element mid-fight.",
        "Platform-specific code should stay out of the high-level logic so each can change and be tested separately."
      ],
      "pitfalls": [
        "Designed too early, Bridge adds indirection for a second dimension that never appears.",
        "The implementor interface must be general enough for every concrete implementor; leaky ones (Slack has no subject line) need care.",
        "It looks a lot like Strategy; the difference is intent: Bridge structures two hierarchies, Strategy swaps one algorithm."
      ],
      "related": [
        "adapter",
        "strategy",
        "abstract-factory",
        "composition"
      ],
      "quiz": [
        {
          "q": "You have 3 remotes and 4 devices. Without Bridge you might write 12 classes. With Bridge, roughly how many?",
          "options": [
            "12",
            "7 (3 + 4)",
            "1",
            "24"
          ],
          "answer": 1,
          "why": "Each hierarchy grows on its own and any remote can hold any device, so the counts add instead of multiply."
        },
        {
          "q": "Which line actually forms the bridge in the remote control demo?",
          "options": [
            "class AdvancedRemote extends RemoteControl",
            "the protected final Device device field in RemoteControl",
            "class Tv implements Device",
            "public static void main"
          ],
          "answer": 1,
          "why": "The bridge is the reference from the abstraction to the implementor. Inheritance stays inside each side; composition connects them."
        }
      ],
      "demos": [
        {
          "id": "bridge-java-remotes",
          "title": "Remotes and devices",
          "lang": "Java",
          "level": "beginner",
          "source": null,
          "story": "Remotes (basic, advanced) and devices (TV, radio) are two separate families. A remote holds a Device, so any remote drives any device without a class per combination.",
          "roles": {
            "Abstraction": [
              "bridge-java-remotes/RemoteControl.java#RemoteControl"
            ],
            "Refined Abstraction": [
              "bridge-java-remotes/AdvancedRemote.java#AdvancedRemote"
            ],
            "Implementor": [
              "bridge-java-remotes/Device.java#Device"
            ],
            "Concrete Implementor": [
              "bridge-java-remotes/Tv.java#Tv",
              "bridge-java-remotes/Radio.java#Radio"
            ],
            "Client": [
              "bridge-java-remotes/Main.java#Main"
            ]
          },
          "trace": [
            {
              "at": "bridge-java-remotes/Main.java#Main.main",
              "say": "main() pairs a basic remote with a TV and an advanced remote with a radio. Any pairing would work."
            },
            {
              "at": "bridge-java-remotes/RemoteControl.java#RemoteControl.togglePower",
              "say": "The remote's buttons are written only in terms of the Device interface: read isOn(), then setPower()."
            },
            {
              "at": "bridge-java-remotes/Tv.java#Tv.setPower",
              "say": "The TV does the low-level work its own way. The remote never knows it is a TV."
            },
            {
              "at": "bridge-java-remotes/RemoteControl.java#RemoteControl.volumeUp",
              "say": "Volume up is one line of high-level logic that every device supports."
            },
            {
              "at": "bridge-java-remotes/AdvancedRemote.java#AdvancedRemote.mute",
              "say": "The refined remote adds a mute button without touching any device class."
            },
            {
              "at": "bridge-java-remotes/Radio.java#Radio.setVolume",
              "say": "The call crosses the bridge to the radio. New remotes and new devices can now be added independently."
            }
          ],
          "files": {
            "bridge-java-remotes/AdvancedRemote.java": "// A Refined Abstraction: more buttons, still works with any Device.\npublic class AdvancedRemote extends RemoteControl {\n    public AdvancedRemote(Device device) {\n        super(device);\n    }\n\n    public void mute() {\n        device.setVolume(0);\n    }\n}\n",
            "bridge-java-remotes/Device.java": "// The Implementor: what every device can do at the lowest level.\npublic interface Device {\n    boolean isOn();\n    void setPower(boolean on);\n    int getVolume();\n    void setVolume(int percent);\n}\n",
            "bridge-java-remotes/Main.java": "public class Main {\n    public static void main(String[] args) {\n        // Any remote works with any device: 2 + 2 classes give 4 combinations.\n        RemoteControl basic = new RemoteControl(new Tv());\n        basic.togglePower();\n        basic.volumeUp();\n\n        AdvancedRemote fancy = new AdvancedRemote(new Radio());\n        fancy.togglePower();\n        fancy.mute();\n    }\n}\n",
            "bridge-java-remotes/Radio.java": "// Another Concrete Implementor: same interface, different hardware.\npublic class Radio implements Device {\n    private boolean on;\n    private int volume = 50;\n\n    public boolean isOn() {\n        return on;\n    }\n\n    public void setPower(boolean on) {\n        this.on = on;\n        System.out.println(\"Radio \" + (on ? \"playing\" : \"silent\"));\n    }\n\n    public int getVolume() {\n        return volume;\n    }\n\n    public void setVolume(int percent) {\n        volume = Math.max(0, Math.min(100, percent));\n        System.out.println(\"Radio volume \" + volume);\n    }\n}\n",
            "bridge-java-remotes/RemoteControl.java": "// The Abstraction: user-facing buttons, built on top of a Device (the bridge).\npublic class RemoteControl {\n    protected final Device device;\n\n    public RemoteControl(Device device) {\n        this.device = device;\n    }\n\n    public void togglePower() {\n        device.setPower(!device.isOn());\n    }\n\n    public void volumeUp() {\n        device.setVolume(device.getVolume() + 10);\n    }\n}\n",
            "bridge-java-remotes/Tv.java": "// A Concrete Implementor.\npublic class Tv implements Device {\n    private boolean on;\n    private int volume = 30;\n\n    public boolean isOn() {\n        return on;\n    }\n\n    public void setPower(boolean on) {\n        this.on = on;\n        System.out.println(\"TV \" + (on ? \"on\" : \"off\"));\n    }\n\n    public int getVolume() {\n        return volume;\n    }\n\n    public void setVolume(int percent) {\n        volume = Math.max(0, Math.min(100, percent));\n        System.out.println(\"TV volume \" + volume);\n    }\n}\n"
          }
        },
        {
          "id": "bridge-gd-weapons",
          "title": "Weapons x elemental runes",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "Weapons decide how you attack (swing an arc, shoot an arrow); elements decide what a hit does (burn, slow). Each weapon holds an Element, so a frost bow needs no FrostBow class.",
          "roles": {
            "Abstraction": [
              "bridge-gd-weapons/weapon.gd#Weapon"
            ],
            "Refined Abstraction": [
              "bridge-gd-weapons/sword.gd#Sword",
              "bridge-gd-weapons/bow.gd#Bow"
            ],
            "Implementor": [
              "bridge-gd-weapons/element.gd#Element"
            ],
            "Concrete Implementor": [
              "bridge-gd-weapons/fire_element.gd#FireElement",
              "bridge-gd-weapons/frost_element.gd#FrostElement"
            ],
            "Client": [
              "bridge-gd-weapons/player.gd#Player"
            ]
          },
          "trace": [
            {
              "at": "bridge-gd-weapons/player.gd#equip",
              "say": "The player equips a weapon and hands it the current rune. Weapon and element are chosen separately."
            },
            {
              "at": "bridge-gd-weapons/weapon.gd#set_element",
              "say": "set_element() swaps the implementor at runtime and tints the weapon to match."
            },
            {
              "at": "bridge-gd-weapons/sword.gd#attack",
              "say": "The sword decides how to attack: play a swing and call hit() on every enemy in its arc."
            },
            {
              "at": "bridge-gd-weapons/weapon.gd#hit",
              "say": "hit() is the bridge in action: the weapon delegates 'what a hit does' to its element."
            },
            {
              "at": "bridge-gd-weapons/fire_element.gd#apply_hit",
              "say": "Fire deals damage and adds a burn. It works the same for a sword, a bow or any future weapon."
            },
            {
              "at": "bridge-gd-weapons/bow.gd#attack",
              "say": "The bow attacks differently, connecting the arrow's landed signal to the same hit(). Element code is reused unchanged."
            },
            {
              "at": "bridge-gd-weapons/frost_element.gd#apply_hit",
              "say": "After picking up a frost rune, the same weapons slow enemies instead. Two weapons x two elements, four small classes."
            }
          ],
          "files": {
            "bridge-gd-weapons/bow.gd": "class_name Bow\nextends Weapon\n\n# Refined Abstraction: shoots an arrow that calls hit() when it lands.\nconst ARROW := preload(\"res://weapons/arrow.tscn\")\n\nfunc attack(aim: Vector2) -> void:\n\tvar arrow := ARROW.instantiate()\n\tarrow.global_position = global_position\n\tarrow.direction = (aim - global_position).normalized()\n\tarrow.landed.connect(hit)\n\tget_tree().current_scene.add_child(arrow)\n",
            "bridge-gd-weapons/element.gd": "class_name Element\nextends RefCounted\n\n# The Implementor: what happens when a hit lands. Weapons do not care which one.\nfunc apply_hit(enemy: Node, damage: int) -> void:\n\tenemy.take_damage(damage)\n\nfunc tint() -> Color:\n\treturn Color.WHITE\n",
            "bridge-gd-weapons/fire_element.gd": "class_name FireElement\nextends Element\n\n# Concrete Implementor: extra burn damage over time.\nfunc apply_hit(enemy: Node, damage: int) -> void:\n\tenemy.take_damage(damage)\n\tenemy.add_status(\"burning\", 3.0, 4)\n\nfunc tint() -> Color:\n\treturn Color.ORANGE_RED\n",
            "bridge-gd-weapons/frost_element.gd": "class_name FrostElement\nextends Element\n\n# Concrete Implementor: less damage, but the enemy slows down.\nfunc apply_hit(enemy: Node, damage: int) -> void:\n\tenemy.take_damage(int(damage * 0.8))\n\tenemy.add_status(\"slowed\", 2.0, 0)\n\nfunc tint() -> Color:\n\treturn Color.LIGHT_BLUE\n",
            "bridge-gd-weapons/player.gd": "class_name Player\nextends CharacterBody2D\n\n# The Client: picks a weapon and an element independently, at runtime.\nvar weapon: Weapon\nvar rune: Element = FireElement.new()\n\nfunc _ready() -> void:\n\tequip($Hand/Sword)\n\nfunc equip(new_weapon: Weapon) -> void:\n\tweapon = new_weapon\n\tweapon.set_element(rune)\n\nfunc _unhandled_input(event: InputEvent) -> void:\n\tif event.is_action_pressed(\"attack\"):\n\t\tweapon.attack(get_global_mouse_position())\n\telif event.is_action_pressed(\"swap_weapon\"):\n\t\tequip($Hand/Bow if weapon is Sword else $Hand/Sword)\n\telif event.is_action_pressed(\"frost_rune\"):\n\t\trune = FrostElement.new()\n\t\tweapon.set_element(rune)\n",
            "bridge-gd-weapons/sword.gd": "class_name Sword\nextends Weapon\n\n# Refined Abstraction: close range, hits everything in its arc.\n@onready var arc: Area2D = $SwingArc\n\nfunc attack(_aim: Vector2) -> void:\n\t$AnimationPlayer.play(\"swing\")\n\tfor body in arc.get_overlapping_bodies():\n\t\tif body.is_in_group(\"enemies\"):\n\t\t\thit(body)\n",
            "bridge-gd-weapons/weapon.gd": "class_name Weapon\nextends Node2D\n\n# The Abstraction: how a weapon attacks. The element is the bridge to \"what a hit does\".\n@export var base_damage := 10\nvar element: Element = Element.new()\n\nfunc set_element(new_element: Element) -> void:\n\telement = new_element\n\tmodulate = element.tint()\n\nfunc attack(_aim: Vector2) -> void:\n\tpass\n\nfunc hit(enemy: Node) -> void:\n\telement.apply_hit(enemy, base_damage)\n"
          }
        },
        {
          "id": "bridge-go-alerts",
          "title": "Ops notifications over many channels",
          "lang": "Go",
          "level": "advanced",
          "source": null,
          "story": "Alerts fire immediately; digests collect events and send a summary. Both hold a Sender interface, so either can go out by Slack or e-mail, and a new channel is one new type.",
          "roles": {
            "Abstraction": [
              "bridge-go-alerts/notification.go"
            ],
            "Refined Abstraction": [
              "bridge-go-alerts/notification.go#Alert",
              "bridge-go-alerts/notification.go#Digest"
            ],
            "Implementor": [
              "bridge-go-alerts/sender.go#Sender"
            ],
            "Concrete Implementor": [
              "bridge-go-alerts/slack.go#SlackSender",
              "bridge-go-alerts/email.go#EmailSender"
            ],
            "Client": [
              "bridge-go-alerts/main.go#Run"
            ]
          },
          "trace": [
            {
              "at": "bridge-go-alerts/main.go#Run",
              "say": "Run() builds two senders, then combines an Alert with Slack and a Digest with e-mail. Swapping them is a one-word change."
            },
            {
              "at": "bridge-go-alerts/notification.go#NewAlert",
              "say": "The constructor stores the Sender in a field. That field is the bridge between the two hierarchies."
            },
            {
              "at": "bridge-go-alerts/notification.go#Alert.Fire",
              "say": "Fire() formats a severity subject and timestamped body: high-level logic that knows nothing about Slack."
            },
            {
              "at": "bridge-go-alerts/slack.go#SlackSender.Send",
              "say": "Slack has no subject, so the implementor folds subject and body into one message. Channel quirks stay on this side."
            },
            {
              "at": "bridge-go-alerts/notification.go#Digest.Add",
              "say": "A digest collects events instead of sending at once: a different abstraction over the same Sender interface."
            },
            {
              "at": "bridge-go-alerts/notification.go#Digest.Flush",
              "say": "Flush() joins the events into one body and crosses the bridge once."
            },
            {
              "at": "bridge-go-alerts/email.go#EmailSender.Send",
              "say": "The e-mail implementor builds SMTP headers. Adding SMS or Teams later means one new Sender, no new notification types."
            }
          ],
          "files": {
            "bridge-go-alerts/email.go": "package alerts\n\nimport (\n\t\"fmt\"\n\t\"net/smtp\"\n)\n\n// EmailSender is a Concrete Implementor that talks SMTP.\ntype EmailSender struct {\n\tHost string\n\tFrom string\n\tAuth smtp.Auth\n}\n\nfunc (e *EmailSender) Send(to string, subject string, body string) error {\n\tmsg := fmt.Sprintf(\"From: %s\\r\\nTo: %s\\r\\nSubject: %s\\r\\n\\r\\n%s\", e.From, to, subject, body)\n\treturn smtp.SendMail(e.Host, e.Auth, e.From, []string{to}, []byte(msg))\n}\n",
            "bridge-go-alerts/main.go": "package alerts\n\nimport (\n\t\"net/http\"\n\t\"time\"\n)\n\n// Run is the Client: it mixes notification kinds and channels freely.\n// Two kinds x two channels = four behaviours from four small types, not four subclasses.\nfunc Run() error {\n\tslack := &SlackSender{WebhookURL: \"https://hooks.slack.example/T000/B000\", Client: &http.Client{Timeout: 5 * time.Second}}\n\temail := &EmailSender{Host: \"mail.example.com:587\", From: \"ops@example.com\"}\n\n\tpager := NewAlert(slack, \"checkout-api\", \"critical\")\n\tif err := pager.Fire(\"#on-call\", \"error rate above 5% for 3 minutes\"); err != nil {\n\t\treturn err\n\t}\n\n\tdaily := NewDigest(email, \"Nightly job summary\")\n\tdaily.Add(\"backup finished in 4m12s\")\n\tdaily.Add(\"2 images failed to resize\")\n\treturn daily.Flush(\"team@example.com\")\n}\n",
            "bridge-go-alerts/notification.go": "package alerts\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n\t\"time\"\n)\n\n// Alert is a Refined Abstraction: one urgent event, sent right away.\n// It HAS a Sender: that field is the bridge between the two hierarchies.\ntype Alert struct {\n\tsender   Sender\n\tservice  string\n\tseverity string\n}\n\nfunc NewAlert(sender Sender, service string, severity string) *Alert {\n\treturn &Alert{sender: sender, service: service, severity: severity}\n}\n\nfunc (a *Alert) Fire(to string, problem string) error {\n\tsubject := fmt.Sprintf(\"[%s] %s\", strings.ToUpper(a.severity), a.service)\n\tbody := fmt.Sprintf(\"%s\\nat %s\", problem, time.Now().Format(time.RFC3339))\n\treturn a.sender.Send(to, subject, body)\n}\n\n// Digest is another Refined Abstraction: it collects events and sends one summary.\ntype Digest struct {\n\tsender Sender\n\ttitle  string\n\tevents []string\n}\n\nfunc NewDigest(sender Sender, title string) *Digest {\n\treturn &Digest{sender: sender, title: title}\n}\n\nfunc (d *Digest) Add(event string) {\n\td.events = append(d.events, event)\n}\n\nfunc (d *Digest) Flush(to string) error {\n\tif len(d.events) == 0 {\n\t\treturn nil\n\t}\n\tbody := \"- \" + strings.Join(d.events, \"\\n- \")\n\td.events = nil\n\treturn d.sender.Send(to, d.title, body)\n}\n",
            "bridge-go-alerts/sender.go": "package alerts\n\n// Sender is the Implementor: the low-level \"deliver this text somewhere\".\n// Notification kinds never depend on a concrete channel, only on this interface.\ntype Sender interface {\n\tSend(to string, subject string, body string) error\n}\n",
            "bridge-go-alerts/slack.go": "package alerts\n\nimport (\n\t\"bytes\"\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"net/http\"\n)\n\n// SlackSender is a Concrete Implementor that posts to an incoming webhook.\n// Slack has no subject line, so it folds subject and body into one message.\ntype SlackSender struct {\n\tWebhookURL string\n\tClient     *http.Client\n}\n\nfunc (s *SlackSender) Send(to string, subject string, body string) error {\n\tpayload, _ := json.Marshal(map[string]string{\n\t\t\"channel\": to,\n\t\t\"text\":    fmt.Sprintf(\"*%s*\\n%s\", subject, body),\n\t})\n\tresp, err := s.Client.Post(s.WebhookURL, \"application/json\", bytes.NewReader(payload))\n\tif err != nil {\n\t\treturn err\n\t}\n\tdefer resp.Body.Close()\n\tif resp.StatusCode >= 300 {\n\t\treturn fmt.Errorf(\"slack: status %d\", resp.StatusCode)\n\t}\n\treturn nil\n}\n"
          }
        }
      ]
    },
    {
      "id": "flyweight",
      "name": "Flyweight",
      "family": "Structural",
      "aka": [
        "Interning",
        "Shared object cache"
      ],
      "tagline": "Share the heavy, identical part of many objects instead of copying it into each one.",
      "intent": "When a program needs huge numbers of similar objects, most of their data is often identical (a texture, a font, a sprite). Flyweight moves that shared, unchanging part (intrinsic state) into one object reused by everyone, keeps only the unique part (extrinsic state, such as position) per object, and uses a factory so equal flyweights are never created twice.",
      "analogy": "A printed map legend: the symbol for 'campsite' is drawn once in the legend and every campsite on the map is just a small mark at a position that refers to it.",
      "cityShape": "Look for a short factory building with a cache antenna on its roof and one get floor that many pipes lead into. Next to it stands a flyweight building with a has link from a small context building; the context's loop floor (draw, _draw, render) sends a dense bundle of pipes to the single flyweight draw floor.",
      "roles": [
        {
          "name": "Flyweight",
          "desc": "Holds the shared, immutable (intrinsic) state and works on extrinsic state passed in as arguments."
        },
        {
          "name": "Flyweight Factory",
          "desc": "Creates flyweights on demand and returns the existing one for an equal key."
        },
        {
          "name": "Context",
          "desc": "The many small per-item records holding only unique (extrinsic) state plus a reference to a flyweight."
        },
        {
          "name": "Client",
          "desc": "Creates items through the factory and drives them, often in a big loop."
        }
      ],
      "whenToUse": [
        "You have thousands or millions of objects (trees, bullets, tiles, characters) and memory or load time is a real problem.",
        "Most of each object's data is identical across many of them and can be made read-only.",
        "Object identity does not matter: two items with the same look may share the same underlying object."
      ],
      "pitfalls": [
        "Shared state must be immutable; changing a flyweight changes every item that uses it.",
        "It trades memory for complexity: extrinsic state now has to be passed around on every call.",
        "For a few dozen objects it is premature optimisation; measure first."
      ],
      "related": [
        "object-pool",
        "singleton",
        "composite",
        "prototype"
      ],
      "quiz": [
        {
          "q": "In the forest demo, which data belongs in the shared TreeType (intrinsic state)?",
          "options": [
            "Each tree's x and y position",
            "The species, colour and texture",
            "The number of trees in the forest",
            "The random seed"
          ],
          "answer": 1,
          "why": "Species, colour and texture are the same for every oak, so they are shared. Position differs per tree and stays in the small Tree context."
        },
        {
          "q": "Why must a flyweight be immutable?",
          "options": [
            "Because Python requires it",
            "Because one change would silently affect every object that shares it",
            "So it can be garbage collected",
            "So the factory can sort it"
          ],
          "answer": 1,
          "why": "Thousands of contexts point at the same flyweight. Changing it is a change for all of them, which is almost never what you meant."
        }
      ],
      "demos": [
        {
          "id": "flyweight-py-forest",
          "title": "A forest of 1,000 trees, 2 textures",
          "lang": "Python",
          "level": "beginner",
          "source": null,
          "story": "A forest plants 1,000 trees, but only two TreeType objects with heavy textures are ever created. Each Tree keeps just x, y and a reference.",
          "roles": {
            "Flyweight": [
              "flyweight-py-forest/tree_type.py#TreeType"
            ],
            "Flyweight Factory": [
              "flyweight-py-forest/tree_factory.py#get_tree_type"
            ],
            "Context": [
              "flyweight-py-forest/forest.py#Tree"
            ],
            "Client": [
              "flyweight-py-forest/forest.py#Forest",
              "flyweight-py-forest/main.py#main"
            ]
          },
          "trace": [
            {
              "at": "flyweight-py-forest/main.py#main",
              "say": "main() plants 1,000 random oaks and pines through the forest."
            },
            {
              "at": "flyweight-py-forest/forest.py#Forest.plant",
              "say": "plant() never builds a TreeType directly. It asks the factory, then stores a tiny Tree with x, y and that shared type."
            },
            {
              "at": "flyweight-py-forest/tree_factory.py#get_tree_type",
              "say": "The factory looks up the key. Only the first oak and the first pine create a TreeType; every later call returns the same object."
            },
            {
              "at": "flyweight-py-forest/tree_type.py#TreeType.__init__",
              "say": "This heavy constructor with its 2 MB texture runs twice in total, not 1,000 times."
            },
            {
              "at": "flyweight-py-forest/forest.py#Tree.draw",
              "say": "A tree draws itself by passing its own position (extrinsic state) to the shared type."
            },
            {
              "at": "flyweight-py-forest/tree_type.py#TreeType.draw",
              "say": "The flyweight combines shared data with the position it was handed. It stores nothing per tree."
            },
            {
              "at": "flyweight-py-forest/tree_factory.py#type_count",
              "say": "The final count proves it: 1,000 trees share 2 TreeType objects."
            }
          ],
          "files": {
            "flyweight-py-forest/forest.py": "from .tree_factory import get_tree_type\nfrom .tree_type import TreeType\n\n\n# The Context: one small object per tree, holding only what is unique to it.\nclass Tree:\n    def __init__(self, x: int, y: int, tree_type: TreeType):\n        self.x = x\n        self.y = y\n        self.tree_type: TreeType = tree_type\n\n    def draw(self) -> None:\n        self.tree_type.draw(self.x, self.y)\n\n\nclass Forest:\n    def __init__(self):\n        self.trees: list[Tree] = []\n\n    def plant(self, x: int, y: int, species: str, color: str, texture_file: str) -> None:\n        tree_type = get_tree_type(species, color, texture_file)\n        self.trees.append(Tree(x, y, tree_type))\n\n    def draw(self) -> None:\n        for tree in self.trees:\n            tree.draw()\n",
            "flyweight-py-forest/main.py": "import random\n\nfrom .forest import Forest\nfrom .tree_factory import type_count\n\n\ndef main() -> None:\n    forest = Forest()\n    for _ in range(1000):\n        species = random.choice([\"oak\", \"pine\"])\n        color = \"dark green\" if species == \"pine\" else \"green\"\n        forest.plant(random.randint(0, 500), random.randint(0, 500), species, color, species + \".png\")\n    forest.trees[0].draw()\n    print(f\"{len(forest.trees)} trees share {type_count()} TreeType objects\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
            "flyweight-py-forest/tree_factory.py": "from .tree_type import TreeType\n\n# The Flyweight Factory: hands out an existing TreeType when one already exists.\n_types = {}\n\n\ndef get_tree_type(species: str, color: str, texture_file: str) -> TreeType:\n    key = (species, color, texture_file)\n    if key not in _types:\n        print(f\"  (creating new TreeType for {species})\")\n        _types[key] = TreeType(species, color, texture_file)\n    return _types[key]\n\n\ndef type_count() -> int:\n    return len(_types)\n",
            "flyweight-py-forest/tree_type.py": "# The Flyweight: the heavy, shared part of a tree (intrinsic state).\n# One TreeType is reused by thousands of trees, so it must never change.\nclass TreeType:\n    def __init__(self, species: str, color: str, texture_file: str):\n        self.species = species\n        self.color = color\n        self.texture = f\"<{texture_file}: 2 MB of pixels>\"\n\n    def draw(self, x: int, y: int) -> None:\n        print(f\"{self.color} {self.species} at ({x}, {y})\")\n"
          }
        },
        {
          "id": "flyweight-gd-bullets",
          "title": "Bullet-hell boss with shared BulletType resources",
          "lang": "GDScript",
          "level": "intermediate",
          "source": null,
          "story": "A boss sprays thousands of bullets. Each bullet kind is one shared BulletType resource, and per-bullet data lives in packed arrays drawn in a single _draw(), with no Node per bullet.",
          "roles": {
            "Flyweight": [
              "flyweight-gd-bullets/bullet_type.gd#BulletType"
            ],
            "Flyweight Factory": [
              "flyweight-gd-bullets/bullet_library.gd#get_type"
            ],
            "Context": [
              "flyweight-gd-bullets/bullet_field.gd#BulletField"
            ],
            "Client": [
              "flyweight-gd-bullets/boss.gd#_on_fire_timer_timeout"
            ]
          },
          "trace": [
            {
              "at": "flyweight-gd-bullets/boss.gd#_on_fire_timer_timeout",
              "say": "Every timer tick the boss fires an 8-arm spiral, alternating two bullet kinds by name."
            },
            {
              "at": "flyweight-gd-bullets/bullet_field.gd#spawn",
              "say": "spawn() asks the library for the shared type, then appends only position, velocity and a type reference."
            },
            {
              "at": "flyweight-gd-bullets/bullet_library.gd#get_type",
              "say": "The library loads each .tres once and caches it. Godot's ResourceLoader caches too; this makes the sharing explicit."
            },
            {
              "at": "flyweight-gd-bullets/bullet_field.gd#_physics_process",
              "say": "Movement updates packed arrays in a tight loop. Off-screen bullets are removed by index, back to front."
            },
            {
              "at": "flyweight-gd-bullets/bullet_field.gd#_draw",
              "say": "One _draw() call renders every bullet, passing each one's position and angle to its shared type."
            },
            {
              "at": "flyweight-gd-bullets/bullet_type.gd#draw_at",
              "say": "The flyweight draws its single texture wherever it is told. Its speed, damage and texture never change at runtime."
            }
          ],
          "files": {
            "flyweight-gd-bullets/boss.gd": "extends Node2D\n\n# The Client: a bullet-hell boss firing a rotating spiral of two bullet kinds.\n@export var field: BulletField\nvar _spin := 0.0\n\nfunc _on_fire_timer_timeout() -> void:\n\t_spin += 0.25\n\tfor arm in 8:\n\t\tvar angle := _spin + arm * TAU / 8.0\n\t\tvar kind := \"orb_small\" if arm % 2 == 0 else \"needle\"\n\t\tfield.spawn(kind, global_position, angle)\n",
            "flyweight-gd-bullets/bullet_field.gd": "class_name BulletField\nextends Node2D\n\n# The Context store: per-bullet (extrinsic) data lives in plain parallel arrays.\n# No Node per bullet: 5,000 bullets cost a few arrays and one _draw call.\nvar positions := PackedVector2Array()\nvar velocities := PackedVector2Array()\nvar types: Array[BulletType] = []\n\nfunc spawn(type_id: String, at: Vector2, angle: float) -> void:\n\tvar type := BulletLibrary.get_type(type_id)\n\tpositions.append(at)\n\tvelocities.append(Vector2.from_angle(angle) * type.speed)\n\ttypes.append(type)\n\nfunc _physics_process(delta: float) -> void:\n\tvar view := get_viewport_rect().grow(32.0)\n\tfor i in range(positions.size() - 1, -1, -1):\n\t\tpositions[i] += velocities[i] * delta\n\t\tif not view.has_point(positions[i]):\n\t\t\t_remove(i)\n\tqueue_redraw()\n\nfunc _draw() -> void:\n\tfor i in positions.size():\n\t\ttypes[i].draw_at(self, positions[i], velocities[i].angle())\n\nfunc _remove(i: int) -> void:\n\tpositions.remove_at(i)\n\tvelocities.remove_at(i)\n\ttypes.remove_at(i)\n",
            "flyweight-gd-bullets/bullet_library.gd": "class_name BulletLibrary\nextends RefCounted\n\n# The Flyweight Factory: loads each BulletType once and hands out the same object.\nstatic var _cache := {}\n\nstatic func get_type(id: String) -> BulletType:\n\tif not _cache.has(id):\n\t\t_cache[id] = load(\"res://bullets/%s.tres\" % id)\n\treturn _cache[id]\n",
            "flyweight-gd-bullets/bullet_type.gd": "class_name BulletType\nextends Resource\n\n# The Flyweight: everything bullets of one kind have in common.\n# Saved as a .tres file and shared by every bullet of that kind.\n@export var texture: Texture2D\n@export var speed := 300.0\n@export var damage := 1\n@export var radius := 6.0\n\nfunc draw_at(canvas: CanvasItem, pos: Vector2, angle: float) -> void:\n\tcanvas.draw_set_transform(pos, angle)\n\tcanvas.draw_texture(texture, -texture.get_size() / 2.0)\n"
          }
        },
        {
          "id": "flyweight-rs-glyphs",
          "title": "Text editor glyph styles with Rc sharing",
          "lang": "Rust",
          "level": "advanced",
          "source": null,
          "story": "A document stores one tiny Glyph per character. Font atlases live in GlyphStyle values interned by a StyleCache and shared through Rc, so three runs of text load only two styles.",
          "roles": {
            "Flyweight": [
              "flyweight-rs-glyphs/src/style.rs#GlyphStyle"
            ],
            "Flyweight Factory": [
              "flyweight-rs-glyphs/src/cache.rs#StyleCache"
            ],
            "Context": [
              "flyweight-rs-glyphs/src/document.rs#Glyph"
            ],
            "Client": [
              "flyweight-rs-glyphs/src/document.rs#Document",
              "flyweight-rs-glyphs/src/main.rs#main"
            ]
          },
          "trace": [
            {
              "at": "flyweight-rs-glyphs/src/main.rs#main",
              "say": "main() types three runs of text; the second and third use the same font, size and weight."
            },
            {
              "at": "flyweight-rs-glyphs/src/document.rs#Document.type_text",
              "say": "type_text() fetches one style for the whole run, then pushes a Glyph per character holding only the char and an Rc clone."
            },
            {
              "at": "flyweight-rs-glyphs/src/cache.rs#StyleCache.get",
              "say": "get() builds a StyleKey and uses the HashMap entry API: load on first sight, otherwise reuse the existing Rc."
            },
            {
              "at": "flyweight-rs-glyphs/src/style.rs#GlyphStyle.load",
              "say": "Loading the 256 KB atlas happens twice in total. Rc::clone only bumps a reference count."
            },
            {
              "at": "flyweight-rs-glyphs/src/document.rs#Document.render",
              "say": "Position is extrinsic: it is computed from the glyph's index while rendering and passed in, never stored in the style."
            },
            {
              "at": "flyweight-rs-glyphs/src/style.rs#GlyphStyle.render",
              "say": "The flyweight reads shared, immutable data plus the arguments it was given. Rust's &self makes the read-only promise explicit."
            },
            {
              "at": "flyweight-rs-glyphs/src/document.rs#Document.stats",
              "say": "The stats show dozens of characters sharing two styles."
            }
          ],
          "files": {
            "flyweight-rs-glyphs/src/cache.rs": "use std::collections::HashMap;\nuse std::rc::Rc;\n\nuse crate::style::{GlyphStyle, StyleKey};\n\n// The Flyweight Factory: interns styles so equal keys share one GlyphStyle.\npub struct StyleCache {\n    styles: HashMap<StyleKey, Rc<GlyphStyle>>,\n}\n\nimpl StyleCache {\n    pub fn new() -> StyleCache {\n        StyleCache { styles: HashMap::new() }\n    }\n\n    pub fn get(&mut self, font: &str, size: u16, bold: bool) -> Rc<GlyphStyle> {\n        let key = StyleKey { font: font.to_string(), size, bold };\n        let style = self\n            .styles\n            .entry(key.clone())\n            .or_insert_with(|| Rc::new(GlyphStyle::load(key)));\n        Rc::clone(style)\n    }\n\n    pub fn len(&self) -> usize {\n        self.styles.len()\n    }\n}\n",
            "flyweight-rs-glyphs/src/document.rs": "use std::rc::Rc;\n\nuse crate::cache::StyleCache;\nuse crate::style::GlyphStyle;\n\n// The Context: one tiny struct per character; the style is a shared pointer.\npub struct Glyph {\n    pub ch: char,\n    pub style: Rc<GlyphStyle>,\n}\n\npub struct Document {\n    glyphs: Vec<Glyph>,\n    cache: StyleCache,\n}\n\nimpl Document {\n    pub fn new() -> Document {\n        Document { glyphs: Vec::new(), cache: StyleCache::new() }\n    }\n\n    pub fn type_text(&mut self, text: &str, font: &str, size: u16, bold: bool) {\n        let style = self.cache.get(font, size, bold);\n        for ch in text.chars() {\n            self.glyphs.push(Glyph { ch, style: Rc::clone(&style) });\n        }\n    }\n\n    // Position is extrinsic: computed while rendering and passed in, never stored in the style.\n    pub fn render(&self, line_width: u32) -> Vec<String> {\n        let mut out = Vec::new();\n        for (i, glyph) in self.glyphs.iter().enumerate() {\n            let i = i as u32;\n            out.push(glyph.style.render(glyph.ch, i % line_width, i / line_width));\n        }\n        out\n    }\n\n    pub fn stats(&self) -> (usize, usize) {\n        (self.glyphs.len(), self.cache.len())\n    }\n}\n",
            "flyweight-rs-glyphs/src/main.rs": "mod cache;\nmod document;\nmod style;\n\nuse document::Document;\n\nfn main() {\n    let mut doc = Document::new();\n    doc.type_text(\"Flyweight \", \"Inter\", 14, true);\n    doc.type_text(\"shares what is the same \", \"Inter\", 12, false);\n    doc.type_text(\"and passes in what differs.\", \"Inter\", 12, false);\n\n    for line in doc.render(40).iter().take(3) {\n        println!(\"{}\", line);\n    }\n    let (chars, styles) = doc.stats();\n    println!(\"{} characters, {} shared styles\", chars, styles);\n}\n",
            "flyweight-rs-glyphs/src/style.rs": "// The Flyweight: font data shared by every character that looks the same.\n// It is immutable, so sharing it through Rc is safe.\n#[derive(Debug, PartialEq, Eq, Hash, Clone)]\npub struct StyleKey {\n    pub font: String,\n    pub size: u16,\n    pub bold: bool,\n}\n\npub struct GlyphStyle {\n    pub key: StyleKey,\n    pub atlas: Vec<u8>,\n}\n\nimpl GlyphStyle {\n    pub fn load(key: StyleKey) -> GlyphStyle {\n        println!(\"loading glyph atlas for {:?}\", key);\n        GlyphStyle { key, atlas: vec![0; 256 * 1024] }\n    }\n\n    pub fn render(&self, ch: char, x: u32, y: u32) -> String {\n        format!(\"{}@({},{}) {}pt{}\", ch, x, y, self.key.size, if self.key.bold { \" bold\" } else { \"\" })\n    }\n}\n"
          }
        }
      ]
    }
  ]
};
