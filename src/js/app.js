import "../css/style.css";
import "./plugins";
import locations from "./store/locations";
import formUI from "./views/form";
import ticketsUI from "./views/tickets";
import currencyUI from "./views/currency";
import favorites from "./store/favorites";

document.addEventListener("DOMContentLoaded", async () => {
  const form = formUI.form;

  // Инициализируем приложение
  await locations.init();
  formUI.setAutocompleteData(locations.shortCities);

  // Добавляем слушателей событий к кнопкам "Add to favorites"
  addFavoriteButtonsEventListeners();

  // Обработчик отправки формы
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });

    ticketsUI.renderTickets(locations.lastSearch);
  });

  // Функция для добавления слушателей событий к кнопкам "Add to favorites"
  function addFavoriteButtonsEventListeners() {
    const addFavoriteButtons = document.querySelectorAll(".add-favorite");
    addFavoriteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const ticketData = JSON.parse(event.target.getAttribute("data-ticket"));
        // Добавляем билет в избранное, используя класс Favorites
        favorites.addTicket(ticketData);
        // Вызываем функцию для обновления дропдауна с избранными билетами
        updateFavoritesDropdown();
      });
    });
  }

  // Функция для обновления дропдауна с избранными билетами
  function updateFavoritesDropdown() {
    const favoritesDropdown = document.getElementById("dropdown1");
    favoritesDropdown.innerHTML = ""; // Очищаем содержимое дропдауна

    favorites.getTickets().forEach((ticket) => {
      // Создаем HTML-разметку для отображения билета в дропдауне
      const ticketElement = `
        <div class="col s12 m6">
          <div class="card ticket-card">
            <div class="ticket-airline d-flex align-items-center">
              <img src="${ticket.airline_logo}" class="ticket-airline-img" />
              <span class="ticket-airline-name">${ticket.airline_name}</span>
            </div>
            <div class="ticket-destination d-flex align-items-center">
              <div class="d-flex align-items-center mr-auto">
                <span class="ticket-city">${ticket.origin_name}</span>
                <i class="medium material-icons">flight_takeoff</i>
              </div>
              <div class="d-flex align-items-center">
                <i class="medium material-icons">flight_land</i>
                <span class="ticket-city">${ticket.destination_name}</span>
              </div>
            </div>
            <div class="ticket-time-price d-flex align-items-center">
              <span class="ticket-time-departure">${ticket.departure_at}</span>
              <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
            </div>
            <div class="ticket-additional-info">
              <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
              <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
            </div>
            <a class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto">Delete</a>
          </div>
        </div>
      `;

      // Вставляем HTML-разметку внутрь favoritesDropdown
      favoritesDropdown.insertAdjacentHTML("beforeend", ticketElement);
    });
  }
});
