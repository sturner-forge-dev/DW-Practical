class FetchData {
  constructor(url, template, pageTitle, res) {
    this.url = url;
    this.template = template;
    this.pageTitle = pageTitle;
    this.res = res;
  }

  async fetchData() {
    const response = await fetch(this.url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      this.res.render(this.template, {
        title: this.pageTitle,
        data: data,
      });
    } else {
      this.res.render("error", {
        message: response.statusText,
        error: { status: response.status, stack: response.stack },
      });
    }
  }
}

module.exports = FetchData;
