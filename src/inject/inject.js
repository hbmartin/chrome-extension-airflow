/* eslint-disable no-restricted-syntax */
function getTriggerNavButton(dagId) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `/admin/airflow/trigger?dag_id=${dagId}`;
  const span = document.createElement('span');
  span.className = 'glyphicon glyphicon-play-circle';
  const trigger = document.createTextNode('  Trigger');
  a.appendChild(span);
  a.appendChild(trigger);
  li.appendChild(a);
  return li;
}

const airflow = () => {
  if (document.title.indexOf('Airflow') === -1) { return; }
  if (window.location.pathname === '/admin/') {
    const alerts = document.getElementsByClassName('alert-info');
    if (alerts.length === 0) { return; }
    const alertText = alerts[0].innerText;
    const triggered = alertText.match(/Triggered (\w*),/);
    if (triggered) {
      const dag = triggered[1];
      window.location.href = `${window.location.origin}/admin/airflow/tree?dag_id=${dag}&num_runs=5`;
    }
  } else if (window.location.pathname === '/admin/airflow/log') {
    window.onscroll = (() => {
      let timeout;
      return () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          // eslint-disable-next-line no-restricted-globals
          timeout = setTimeout(() => { location.reload(true); }, 10000);
        } else if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
    })();
    window.scrollTo(0, document.body.scrollHeight);
    window.onscroll();
  } else if (window.location.pathname === '/admin/airflow/tree') {
    if (document.getElementsByClassName('running').length !== 0) {
      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => { location.reload(true); }, 10000);
    }
    const ul = document.getElementsByClassName('nav-pills')[0];
    const dagId = window.location.search.match(/dag_id=(\w*)/)[1];
    ul.appendChild(getTriggerNavButton(dagId));

    const states = document.getElementsByClassName('state');
    for (const el of states) {
      if (el.dataset && el.dataset.originalTitle) {
        const duration = el.dataset.originalTitle.match(/Duration: (\d+(\.\d+)?)/);
        if (duration) {
          const durationSeconds = parseFloat(duration[1]);
          let durationFormatted = 'Duration: ';
          if (durationSeconds > 3600) {
            durationFormatted += `${(durationSeconds / 3600).toFixed(2)} h`;
          } else if (durationSeconds > 60) {
            durationFormatted += `${(durationSeconds / 60).toFixed(2)} m`;
          } else {
            durationFormatted += durationSeconds;
          }
          const newTitle = el.dataset.originalTitle.replace(duration[0], durationFormatted);
          el.dataset.originalTitle = newTitle;
        }
      }
    }
  }
};

if (document.title.indexOf('Airflow') !== -1) {
  // inject dark mode css
  const link = document.createElement('link');
  // eslint-disable-next-line no-undef
  link.href = chrome.runtime.getURL('src/inject/dark.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

// document.addEventListener('DOMContentLoaded', airflow, false);
airflow();
