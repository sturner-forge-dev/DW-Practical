class FetchData {
  constructor(url, title, res) {
    this.url = url;
    this.title = title;
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
      this.res.render("results", {
        title: this.title,
        data: data,
      });
    } else {
      this.res.render("error", {
        message: response.statusText,
      });
    }
  }
}

module.exports = FetchData;
