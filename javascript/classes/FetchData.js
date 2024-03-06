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
      if (data.length === 0 || data === undefined || data === null) {
        return this.res.render("error", {
          message:
            "No election data found for given location. Please enter a different location.",
        });
      }
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
