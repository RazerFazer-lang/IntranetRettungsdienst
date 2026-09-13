const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const rootDir = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(rootDir, 'checklists.js'), 'utf8');
new Function(source);

const listeners = new Map();
const app = { innerHTML: '', addEventListener(type, fn) { listeners.set(type, fn); } };
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
  querySelector() { return null; },
};
const window = {};

vm.runInNewContext(source, {
  window, document, localStorage, console, setTimeout, clearTimeout,
  JSON, Math, Number, String, Array, Object,
});

assert.equal(typeof window.renderChecklisten, 'function');
assert.ok(window.RD_CHECKLISTS);
assert.equal(Object.keys(window.RD_CHECKLISTS).length, 8);

for (const [id, checklist] of Object.entries(window.RD_CHECKLISTS)) {
  assert.equal(checklist.questions.length, 12, `${id} must contain 12 questions`);
  assert.ok(Array.isArray(checklist.plan) && checklist.plan.length > 0, `${id} needs a plan`);
  for (const item of checklist.questions) {
    assert.equal(typeof item, 'object');
    assert.ok(item.title && item.text && item.hint, `${id}: invalid question object`);
    assert.ok(Array.isArray(item.answers) && item.answers.length >= 2);
    for (const choice of item.answers) {
      assert.ok(choice.label);
      assert.ok(['normal', 'warning', 'critical'].includes(choice.level), `${id}: invalid answer severity`);
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
  assert.equal(typeof fn, 'function', 'Checklist handler must be attached to #app');
  fn({ preventDefault() {}, target: eventTarget(attrs) });
}

function completeCurrentChecklist(id) {
  click({ 'data-cl-open': id });
  assert.match(app.innerHTML, /CHECKLISTE \/ 1 VON 12/);
  for (let i = 0; i < 12; i++) {
    click({ 'data-cl-answer': '0' });
    if (i < 11) click({ 'data-cl-next': '' });
  }
  assert.match(app.innerHTML, /ABFRAGE ABGESCHLOSSEN/);
  assert.match(app.innerHTML, /Fragenprotokoll/);
}

window.renderChecklisten();
assert.match(app.innerHTML, /data-cl-open="ABCDE"/);
assert.equal(breadcrumb.textContent, 'Checklisten');

// Exercise navigation/state for ABCDE.
click({ 'data-cl-open': 'ABCDE' });
click({ 'data-cl-answer': '0' });
click({ 'data-cl-next': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 2 VON 12/);
click({ 'data-cl-jump': '5' });
assert.match(app.innerHTML, /CHECKLISTE \/ 6 VON 12/);
click({ 'data-cl-prev': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 5 VON 12/);
click({ 'data-cl-back': '' });
assert.match(app.innerHTML, /data-cl-open="ABCDE"/);

// Reopen ABCDE to verify local persistence and then reset it.
click({ 'data-cl-open': 'ABCDE' });
assert.match(app.innerHTML, /CHECKLISTE \/ 2 VON 12/);
click({ 'data-cl-reset': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 1 VON 12/);
click({ 'data-cl-back': '' });

// Every checklist must at least open and complete end-to-end.
for (const id of Object.keys(window.RD_CHECKLISTS)) completeCurrentChecklist(id);

click({ 'data-cl-reset': '' });
assert.match(app.innerHTML, /CHECKLISTE \/ 1 VON 12/);

console.log('checklists smoke test: PASS');
