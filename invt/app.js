const d = document.body.dataset;
const $ = id => document.getElementById(id);
const key = `answer:${d.kind}:${d.slug}`;
const texts = { yes: d.yes, no: d.no };

function showDone(answer) {
  $("form").hidden = true;
  $("done").hidden = false;
  $("doneText").textContent = texts[answer];
}

function busy(on) { $("yes").disabled = on; $("no").disabled = on; }

async function send(answer) {
  $("err").hidden = true;
  busy(true);
  const payload = {
    slug: d.slug, name: d.name, kind: d.kind, answer,
    count: $("count") ? $("count").value : "",
    comment: $("comment").value
  };
  try {
    // text/plain + no-cors: так Google Apps Script принимает запрос без лишних настроек
    await fetch(d.url, { method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) });
    try { localStorage.setItem(key, answer); } catch (e) {}
    showDone(answer);
  } catch (e) { $("err").hidden = false; }
  busy(false);
}

$("yes").onclick = () => send("yes");
$("no").onclick = () => send("no");
$("change").onclick = () => { $("done").hidden = true; $("form").hidden = false; };

try { const prev = localStorage.getItem(key); if (prev) showDone(prev); } catch (e) {}
