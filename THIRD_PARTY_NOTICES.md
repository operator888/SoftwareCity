# Third-party notices

Software City's pattern library ships demo code drawn from a number of open-source projects. Each demo retains the copyright and licence of its source repository. Software City itself does not claim copyright over those snippets. Redistribution follows the licence terms of each source.

If you fork Software City and redistribute one of these demos, the licence of the source repository applies to that demo. Software City's own dual licence (Polyform Noncommercial 1.0.0 + paid commercial licence) applies to the rest of the project.

## Runtime libraries bundled into `dist/app.*.js`

| Library | Version | Licence |
|---|---|---|
| three.js (`mrdoob/three.js`, incl. `examples/jsm/controls/OrbitControls.js`) | 0.161.0 | MIT |
| dagre (`dagrejs/dagre`) | 0.8.5 | MIT |

## Fonts (self-hosted WOFF2 in `assets/fonts/`)

Architects Daughter, Barlow, Barlow Condensed, JetBrains Mono — SIL Open Font License 1.1.

## Pattern-library demo sources

Source repositories, in alphabetical order:

| Project | Licence | Patterns that use it |
|---|---|---|
| `axios/axios` | MIT | Adapter |
| `behavior3/behavior3js` | MIT | Behavior Tree |
| `bevyengine/bevy` | MIT OR Apache-2.0 | ECS |
| `bobthemighty/punq` | MIT | Service Locator |
| `bxcodec/go-clean-arch` | MIT | Clean Architecture, Hexagonal |
| `connor4312/cockatiel` | MIT | Circuit Breaker |
| `developit/mitt` | MIT | Pub/Sub, Observer |
| `django/django` | BSD-3-Clause | Active Record, Repository |
| `dotnet/eShop` | MIT | DDD aggregates, value objects, mediator, CQRS |
| `eslint/eslint` | MIT | Visitor |
| `go-chi/chi` | MIT | Chain of Responsibility, Middleware |
| `godotengine/godot-demo-projects` | MIT | State Machine, Update Method, Game Loop, Multiplayer |
| `golang/go` | BSD-3-Clause | Container/List, sort, sync, io.MultiReader |
| `GoogleCloudPlatform/microservices-demo` | Apache-2.0 | Microservices |
| `IceCreamYou/MainLoop.js` | MIT | Game Loop |
| `jashkenas/underscore` | MIT | Higher-Order Functions, Debounce |
| `jodal/pykka` | Apache-2.0 | Actor |
| `knex/knex` | MIT | Query Builder, Fluent Interface |
| `more-itertools/more-itertools` | MIT | Higher-Order Functions |
| `mrdoob/three.js` | MIT | Object3D, GPU Computation |
| `mroderick/PubSubJS` | MIT | Pub/Sub, Observer |
| `pallets/flask` | BSD-3-Clause | Blueprint, MVC |
| `php-fig/log` | MIT | Null Object |
| `preactjs/preact` | MIT | Factory Method, JSX |
| `python/cpython` | PSF-2.0 | Queue, bisect, asyncio, sched, functools, logging, copy, undo, socketserver, _collections_abc |
| `ramda/ramda` | MIT | Currying, Composition |
| `reduxjs/redux` | MIT | Observer, Middleware, Reducer |
| `ReactiveX/rxjs` | Apache-2.0 | Reactive Streams |
| `sindresorhus/on-change` | MIT | Observer, Proxy |
| `sindresorhus/p-limit` | MIT | Semaphore, Rate Limiting |
| `sqlalchemy/sqlalchemy` | MIT | Unit of Work, Identity Map |
| `supermacro/neverthrow` | MIT | Result, Option |
| `symfony/expression-language` | MIT | Interpreter, Composite |
| `tastejs/todomvc` | MIT | MVC, Observer |
| `TheAlgorithms/Python` | MIT | Binary Search Tree, Hash Table, Brackets, Knapsack, Dijkstra, Islands |
| `timohausmann/quadtree-js` | MIT | Spatial Partitioning |
| `tkem/cachetools` | MIT | Cache-Aside, Decorator |
| `webpack/tapable` | MIT | Hooks, Observer |
| `wooorm/trough` | MIT | Middleware |

## Licence texts

The full text of each licence is reproduced below, unmodified. These are the licences that govern the bundled demo code, not Software City itself.

### MIT (Massachusetts Institute of Technology)

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

### BSD-3-Clause (Berkeley Software Distribution)

> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
>
> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
>
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
>
> 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

### Apache-2.0 (Apache License, Version 2.0)

> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
>
> <https://www.apache.org/licenses/LICENSE-2.0>
>
> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

### PSF-2.0 (Python Software Foundation License, Version 2)

> 1. This LICENSE AGREEMENT is between the Python Software Foundation ("PSF"), and the Individual or Organization ("Licensee") accessing and otherwise using this software ("Python") in source or binary form and its associated documentation.
>
> 2. Subject to the terms and conditions of this License Agreement, PSF hereby grants Licensee a non-exclusive, royalty-free, world-wide license to reproduce, analyze, test, perform and/or display publicly, prepare derivative works, distribute, and otherwise use Python alone or in any derivative version, provided, however, that PSF's License Agreement and PSF's notice of copyright, i.e., "Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023 Python Software Foundation; All Rights Reserved" are retained in Python alone or in any derivative version prepared by Licensee.
>
> 3. In the event Licensee prepares a derivative work that is based on or incorporates Python or any part thereof, and wants to make the derivative work available to others as provided herein, then Licensee hereby agrees to include in any such work a brief summary of the changes made to Python.
>
> 4. PSF is making Python available to Licensee on an "AS IS" basis. PSF MAKES NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED. BY WAY OF EXAMPLE, BUT NOT LIMITATION, PSF MAKES NO AND DISCLAIMS ANY REPRESENTATION OR WARRANTY OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF PYTHON WILL NOT INFRINGE ANY THIRD PARTY RIGHTS.
>
> 5. PSF SHALL NOT BE LIABLE TO LICENSEE OR ANY OTHER USERS OF PYTHON FOR ANY INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES OR LOSS AS A RESULT OF MODIFYING, DISTRIBUTING, OR OTHERWISE USING PYTHON, OR ANY DERIVATIVE THEREOF, EVEN IF ADVISED OF THE POSSIBILITY THEREOF.
>
> 6. This License Agreement will automatically terminate upon a material breach of its terms and conditions.
>
> 7. Nothing in this License Agreement shall be deemed to create any relationship of agency, partnership, or joint venture between PSF and Licensee. This License Agreement does not grant permission to use PSF trademarks or trade name in a trademark sense to endorse or promote products or services of Licensee, or any third party.
>
> 8. By copying, installing or otherwise using Python, Licensee agrees to be bound by the terms and conditions of this License Agreement.