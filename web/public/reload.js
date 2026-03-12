const evtSource = new EventSource('/events');
evtSource.onmessage = () => location.reload();
