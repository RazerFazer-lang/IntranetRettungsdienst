const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const rootDir = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(rootDir, 'checklists.js'), 'utf8');

// 1) Syntax check: the standalone checklist controller must parse as JavaScript.
new Function(source);

// 2) Minimal DOM/runtime harness. The controller only needs #app, the breadcrumb,
//    localStorage and a click target exposing closest()/hasAttribute()/getAttribute().
const listeners = new Map();
const app = {
  innerHTML: '',
  __stableChecklistBound: false,
  addEventListener(type, fn) { listeners.set(type, fn); },
};
const breadcrumb = { textContent: '' };
const storage = new Map();
const localStorage = {
  getItem(k) { return storage.has(k) ? storage.get(k) : null; },
  setItem(k, v) { storage.set(k, String(v)); },
  removeItem(k) { storage.delete(k); },
};

const document = {
  getElementById(id) {
    if (id === 'app') return app;
    if (id === 'breadcrumbCurrent') return breadcrumb;
    return null;
  },
};
const window = {};

vm.runInNewContext(source, {
  window,
  document,
  localStorage,
  console,
  setTimeout,
  clearTimeout,
  JSON,
  Math,
  Number,
  String,
  Array,
});

assert.equal(typeof window.renderChecklisten, 'function', 'renderChecklisten must be exported');
assert.ok(window.RD_CHECKLISTS, 'RD_CHECKLISTS must exist');
assert.equal(Object.keys(window.RD_CHECKLISTS).length, 8, 'Expected 8 checklist modules');
for (const [id, checklist] of Object.entries(window.RD_CHECKLISTS)) {
  assert.equal(checklist.questions.length, 12, `${id} must contain 12 questions`);
  for (const q of checklist.questions) {
    assert.equal(q.length, 4, `${id}: question tuple must contain title/text/answers/hint`);
    assert.ok(q[0] && q[1], `${id}: question must have title and text`);
    assert.ok(Array.isArray(q[2]) && q[2].length >= 2, `${id}: question needs answer choices`);
    for (const choice of q[2]) {
      assert.ok(Array.isArray(choice) && choice.length === 2, `${id}: answer choice shape invalid`);
      assert.ok(['normal', 'warning', 'critical'].includes(choice[1]), `${id}: invalid answer severity`);
    }
  }
}

function eventTarget(attrs) {
  return {
    closest() { return this; },
    hasAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name); },
    getAttribute(name) { return attrs[name] ?? null; },
  };
}
function click(attrs) {
  const fn = listeners.get('click');
  assert.equal(typeof fn, 'function', 'Checklist click handler must be bound to #app');
  fn({ preventDefault() {}, target: eventTarget(attrs) });
}

// 3) Render overview and open a checklist.
window.renderChecklisten();
assert.match(app.innerHTML, /data-cl-open="ABCDE"/, 'Overview must expose ABCDE as clickable');
assert.equal(breadcrumb.textContent, 'Checklisten');

click({ 'data-cl-open': 'ABCDE' });
assert.match(app.innerHTML, /CHECKLISTE \/ 1 VON 12/, 'Opening ABCDE must render question 1');
assert.match(app.innerHTML, /Atemweg|Reaktion|Eigenschutz/, 'Question navigation must be present');

// 4) Select an answer and advance.
click({ 'data-cl-answer': '0' });
assert.match(app.innerHTML, /Nächste Frage/, 'Selecting an answer must keep the checklist interactive');
click({ 'data-cl-next': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 2 VON 12/, 'Next must advance exactly one question');

// 5) Jump directly to question 6, then go back once.
click({ 'data-cl-jump': '5' });
assert.match(app.innerHTML, /CHECKLISTE \/ 6 VON 12/, 'Question jump must work');
click({ 'data-cl-prev': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 5 VON 12/, 'Back must go to previous question');

// 6) Return to overview, reopen and verify local persistence.
click({ 'data-cl-back': '' });
assert.match(app.innerHTML, /data-cl-open="ABCDE"/, 'Back must return to checklist overview');
click({ 'data-cl-open': 'ABCDE' });
assert.match(app.innerHTML, /CHECKLISTE \/ 2 VON 12/, 'Saved answer must allow continuation');

// 7) Complete all remaining questions. The last answer should produce the result screen
//    without any recursion or event-handler churn.
for (let i = 1; i < 12; i++) {
  click({ 'data-cl-answer': '0' });
  if (!/ABFRAGE ABGESCHLOSSEN/.test(app.innerHTML)) {
    click({ 'data-cl-next': '' });
  }
}
assert.match(app.innerHTML, /ABFRAGE ABGESCHLOSSEN/, 'Final answer must open result view');
assert.match(app.innerHTML, /Fragenprotokoll/, 'Result view must contain question protocol');

// 8) Reset from the result screen and ensure a fresh question starts.
click({ 'data-cl-reset': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 1 VON 12/, 'Reset must start the checklist again');

console.log('checklists smoke test: PASS');
