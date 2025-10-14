// 'use strict';

//все что касается списка желаний
let w = '';
let count = 0;
let countCart = parseInt(localStorage.getItem('countCart')) || 0;

const x = document.querySelector('#wishlist-body');
console.log(x);

const hurd = document.querySelector('.product-wishlist');
console.log(count);

document.addEventListener('click', addProduct);

function addProduct(e) {
  console.log(e.target.dataset.id);
  if (
    e.target.classList.contains('product-wishlist') &&
    e.target.getAttribute('stroke') === 'grey'
  ) {
    document
      .querySelectorAll(`[data-id="${e.target.dataset.id}"]`)
      .forEach(function (element) {
        element.setAttribute(
          'stroke',
          element.getAttribute('stroke') === 'grey' ? 'red' : 'grey',
        );
      });

    count += 1;
    console.log(count);
    document.querySelectorAll('.wishlist-count').forEach(function (el) {
      el.innerHTML = count;
    });

    const tr = document.createElement('tr');
    tr.setAttribute('data-id', `wishlist-row-${e.target.dataset.id}`);
    tr.classList.add('body-tr');

    const tdName = document.createElement('td');
    tdName.innerHTML = e.target.dataset.name;
    tr.appendChild(tdName);

    const tdPrice = document.createElement('td');
    tdPrice.innerHTML = e.target.dataset.price;
    tr.appendChild(tdPrice);

    const action = document.createElement('td');
    action.innerHTML = 'Delete';
    action.classList.add('delete');

    tr.appendChild(action);
    x.appendChild(tr);

    return;
  }

  const r = e.target.closest('tr');
  if (e.target.classList.contains('delete')) {
    count -= 1;
    console.log(count);
    document.querySelectorAll('.wishlist-count').forEach(function (elem) {
      elem.innerHTML = count;
    });

    let number = e.target
      .closest('tr')
      .getAttribute('data-id')
      .replace('wishlist-row-', '');
    document.querySelectorAll(`[data-id="${number}"]`).forEach(function (el) {
      el.setAttribute(
        'stroke',
        el.getAttribute('stroke') === 'grey' ? 'red' : 'grey',
      );
    });

    r.remove();
  }

  if (
    e.target.classList.contains('product-wishlist') &&
    e.target.getAttribute('stroke') === 'red'
  ) {
    document
      .querySelectorAll(`[data-id="${e.target.dataset.id}"]`)
      .forEach(function (el) {
        el.setAttribute(
          'stroke',
          el.getAttribute('stroke') === 'grey' ? 'red' : 'grey',
        );
      });

    count -= 1;
    document.querySelectorAll('.wishlist-count').forEach(function (el) {
      el.innerHTML = count;
    });

    let u = document.querySelector(
      `[data-id="wishlist-row-${e.target.dataset.id}"`,
    );
    console.log(u);
    u.remove();

    return;
  }

  w = e.target.getAttribute('stroke');
}

//все что касается корзины

// Массив обьектов для хранения товаров в корзине
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция добавления товара в корзину
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1; // Увеличиваем количество, если товар уже есть
  } else {
    cart.push({
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: 1,
    });
  }
  countCart += 1; // Увеличиваем общее количество товаров
  saveCart();
  renderCart();
  calcCart(countCart); // Обновляем отображение
}

// Функция удаления товара из корзины
function removeFromCart(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    countCart -= item.quantity; // Уменьшаем countCart на количество удаляемого товара
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
    calcCart(countCart); // Обновляем отображение
  }
}
// Функция изменения количества
function updateQuantity(id, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(id); // Если количество меньше 1, удаляем товар
    return;
  }

  const item = cart.find((item) => item.id === id);
  if (item) {
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;
    countCart += newQuantity - oldQuantity; // Обновляем countCart

    saveCart();
    renderCart();
    calcCart(countCart); // Обновляем отображение
  }
}

// Функция рендера корзины
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    document.getElementById('clear-cart').disabled = true;
    totalPrice.innerHTML = 0;
    countCart = 0; // Сбрасываем countCart
    calcCart(countCart);
    return;
  }

  document.getElementById('clear-cart').disabled = false;

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">

            <div class="cart-item-details">
              <h4>${item.name}</h4>
            </div>
              <div class="quantity-controls">
                  <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity} - 1)">-</button>
                  <span class="quantity-buy">${item.quantity}</span>
                  <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity} + 1)">+</button>
              </div>

            <span class="item-price">${(item.price * item.quantity).toFixed(0)} &#8372</span>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Х</button>
        </div>
    `,
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // console.log(total);
  totalPrice.textContent = `${total.toFixed(0)} UAN`;
}

// Функция сохранения в localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('countCart', JSON.stringify(countCart));
}

// Функция очистки корзины
document.getElementById('clear-cart').addEventListener('click', function () {
  if (confirm('Вы уверены, что хотите очистить корзину?')) {
    cart = [];
    countCart = 0;

    calcCart(countCart);
    saveCart();
    renderCart();
  }
});

// добавление к корзине кол-ва товара
function calcCart(x) {
  const countBasket = document.querySelectorAll('.basket-count');
  countCart = x;
  countBasket.forEach((item) => {
    item.innerHTML = x;
  });
  localStorage.setItem('countCart', JSON.stringify(countCart));
}

// Обработчики событий для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart1').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.preventDefault(); // Предотвращаем переход по href="#buy"

    const id = this.dataset.id;
    const name = this.dataset.name;
    // console.log(name);
    const price = this.dataset.price;
    addToCart(id, name, price);
    this.textContent = 'Добавлено!';
    setTimeout(() => {
      this.textContent = 'add to cart';
    }, 2000);
  });
});

// Инициализация при загрузке страницы
renderCart();
calcCart(countCart);

// все что косается формы
document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const submitButton = document.querySelector('.contact-button');
  const form = document.querySelector('.contact-form');

  // Проверка наличия всех элементов
  if (!nameInput || !emailInput || !phoneInput || !submitButton || !form) {
    console.error('Один или несколько элементов формы не найдены в DOM');
    return;
  }



  // Функция для проверки валидности всех полей
  function checkFormValidity() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    const isNameValid = /^[a-zA-Zа-яА-ЯґҐєЄіІїЇ]{2,}$/.test(name);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPhoneValid = /^\+\d{12}$/.test(phone);

    submitButton.disabled = !(isNameValid && isEmailValid && isPhoneValid);
  }

  // Обмеження вводу для імені (тільки літери)
  nameInput.addEventListener('input', function (e) {
    const value = e.target.value;
    e.target.value = value.replace(/[^a-zA-Zа-яА-ЯґҐєЄіІїЇ]/g, '');
    const nameError = document.getElementById('nameError');
    if (value && !/^[a-zA-Zа-яА-ЯґҐєЄіІїЇ]+$/.test(value)) {
      nameError.style.display = 'block';
    } else {
      nameError.style.display = 'none';
    }
    checkFormValidity();
  });

  // Валідація email у реальному часі
  emailInput.addEventListener('input', function (e) {
    const value = e.target.value;
    const emailError = document.getElementById('emailError');
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      emailError.style.display = 'block';
    } else {
      emailError.style.display = 'none';
    }
    checkFormValidity();
  });

  // Обмеження та валідація вводу для телефону
  phoneInput.addEventListener('input', function (e) {
    const value = e.target.value;
    const phoneError = document.getElementById('phoneError');
    e.target.value = value.replace(/[^0-9+]/g, '');
    if (value && !/^\+\d{0,12}$/.test(value)) {
      phoneError.style.display = 'block';
    } else if (value && !/^\+\d{12}$/.test(value)) {
      phoneError.style.display = 'block';
    } else {
      phoneError.style.display = 'none';
    }
    checkFormValidity();
  });

  // Валідація форми при відправці
  function validateForm(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Очистка предыдущих ошибок
    document
      .querySelectorAll('.error-message')
      .forEach((error) => (error.style.display = 'none'));

    // Очистка сообщения об успехе
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
      successMessage.style.display = 'none';
    }

    // Получение значений полей
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();

    let isValid = true;

    // Валидация имени (только буквы, минимум 2 символа)
    if (!/^[a-zA-Zа-яА-ЯґҐєЄіІїЇ]{2,}$/.test(name)) {
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
    }

    // Валидация телефона (+ и 12 цифр)
    if (!/^\+\d{12}$/.test(phone)) {
      document.getElementById('phoneError').style.display = 'block';
      isValid = false;
    }

    // Валидация email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
    }

    // Показ сообщения об успехе
    if (isValid && successMessage) {
      successMessage.style.display = 'block';
      form.reset(); // Сбрасываем форму
      checkFormValidity(); // Обновляем состояние кнопки
    }

    return isValid;
  }

  // Привязка функции validateForm к событию отправки формы
  form.addEventListener('submit', validateForm);
});

// //lang-switcher
// // Выбираем все ссылки языков (для маленьких и больших экранов)
// const langLinks = document.querySelectorAll('.lang__link');
// const langSwitcher = document.querySelector('.lang-switcher');
// const currentLangSpan = langSwitcher.querySelector(
//   '.lang-switcher__current span',
// );

// // Объект с переводами для всех языков
// const translations = {
//   en: {
//     title:
//       'The New Start of <br><span class="header__title--color">VR LOCOMOTION</span>',
//     description:
//       'Discover the most comprehensive VR Locomotion system, and unlock infinite motion in any games on any platforms!',
//     buyButton: 'Buy Now',
//   },
//   ru: {
//     title:
//       'Новый старт <br><span class="header__title--color">VR-локомоции</span>',
//     description:
//       'Откройте самую полную систему VR-локомоции и разблокируйте бесконечное движение в любых играх на любых платформах!',
//     buyButton: 'Купить сейчас',
//   },
//   uk: {
//     title:
//       'Новий Початок <br><span class="header__title--color">VR Локомоції</span>',
//     description:
//       'Відкрийте найповнішу систему VR локомоції та розблокуйте безмежний рух у будь-яких іграх на будь-яких платформах!',
//     buyButton: 'Купити Зараз',
//   },
// };
