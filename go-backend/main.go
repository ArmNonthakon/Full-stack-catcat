package main

import (
	"fmt"
	"time"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type CustomerHandler struct {
	DB *gorm.DB
}

type Cat struct {
	gorm.Model
	Name     string
	Describe string
	Breed    string
	Old      int
	Color    string
	Gender   string
	Pic      string
}
type User struct {
	gorm.Model
	Name     string
	Surname  string
	Email    string
	Password string
}
type InputUser struct {
	Email    string
	Password string
}
type InputCategory struct {
	Gender []string
	Color  []string
	Age    []int
}

func (h *CustomerHandler) Initialize() {

	dsn := "host=aws-0-ap-southeast-1.pooler.supabase.com user=postgres.snpblspofpidyfveqljs password=Ninjaarm-20032546 dbname=catdata port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}
	db.AutoMigrate(&Cat{})
	db.AutoMigrate(&User{})

	h.DB = db
}
func (h *CustomerHandler) getData(c *fiber.Ctx) error {
	data := []Cat{}
	result := h.DB.Find(&data)
	if result.Error != nil {
		panic("Failed to get data")
	}
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	name := claims["name"].(string)
	return c.JSON(fiber.Map{
		"data": data,
		"user": name,
	})
}
func (h *CustomerHandler) getDataByName(c *fiber.Ctx) error {
	name := new(Cat)
	if err := c.BodyParser(name); err != nil {
		return err
	}
	data := []Cat{}
	result := h.DB.Find(&data, "name = ?", name.Name)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}
	return c.JSON(fiber.Map{
		"data": data,
	})
}
func (h *CustomerHandler) getDataByCategory(c *fiber.Ctx) error {
	input := new(InputCategory)
	if err := c.BodyParser(input); err != nil {
		return err
	}
	data := []Cat{}

	if len(input.Gender) == 0 && len(input.Color) == 0 {
		if input.Age[1] > 0 {
			result := h.DB.Find(&data, "old between ? and ?", input.Age[0], input.Age[1])

			if result.Error != nil {
				return c.SendStatus(fiber.StatusNotFound)
			}
			return c.JSON(fiber.Map{
				"data": data,
			})
		}
		return c.SendStatus(fiber.StatusBadRequest)
	}
	if len(input.Gender) != 0 && len(input.Color) != 0 {
		if input.Age[1] > 0 {
			result := h.DB.Find(&data, "gender in ? and color in ? and old between ? and ?", input.Gender, input.Color, input.Age[0], input.Age[1])

			if result.Error != nil {
				return c.SendStatus(fiber.StatusNotFound)
			}
			return c.JSON(fiber.Map{
				"data": data,
			})
		}
		result := h.DB.Find(&data, "gender in ? and color in ?", input.Gender, input.Color)

		if result.Error != nil {
			return c.SendStatus(fiber.StatusNotFound)
		}
		return c.JSON(fiber.Map{
			"data": data,
		})
	}
	if len(input.Gender) != 0 {
		if input.Age[1] > 0 {
			result := h.DB.Find(&data, "gender in ? and old between ? and ?", input.Gender, input.Age[0], input.Age[1])

			if result.Error != nil {
				return c.SendStatus(fiber.StatusNotFound)
			}
			return c.JSON(fiber.Map{
				"data": data,
			})
		}
		result := h.DB.Find(&data, "gender in ?", input.Gender)
		if result.Error != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"data": data,
		})
	}
	if len(input.Color) != 0 {
		if input.Age[1] > 0 {
			result := h.DB.Find(&data, "color in ? and old between ? and ?", input.Color, input.Age[0], input.Age[1])

			if result.Error != nil {
				return c.SendStatus(fiber.StatusNotFound)
			}
			return c.JSON(fiber.Map{
				"data": data,
			})
		}
		result := h.DB.Find(&data, "color in ?", input.Color)
		if result.Error != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}
		return c.JSON(fiber.Map{
			"data": data,
		})
	}
	return c.SendStatus(fiber.StatusBadRequest)

}
func (h *CustomerHandler) getDataByID(c *fiber.Ctx) error {
	data := Cat{}
	id := c.Params("catId")
	result := h.DB.Find(&data, id)
	if result.Error != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}
	if data.ID == 0 {
		return c.SendStatus(fiber.StatusNotFound)
	}
	return c.JSON(data)
}
func (h *CustomerHandler) addData(c *fiber.Ctx) error {
	data := new(Cat)
	if err := c.BodyParser(data); err != nil {
		return err
	}
	result := h.DB.Create(&data)
	if result.Error != nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}
	return c.JSON(data)
}
func (h *CustomerHandler) deleteData(c *fiber.Ctx) error {
	data := new(Cat)
	id := c.Params("catId")
	result := h.DB.Find(&data, id)
	if result.Error != nil {
		panic("")
	}
	result = h.DB.Delete(&data)
	if result.Error != nil {
		panic(result.Error)
	}
	return c.JSON("Delete success")
}
func (h *CustomerHandler) updateData(c *fiber.Ctx) error {
	return c.JSON("update")
}

func checkMiddleware(c *fiber.Ctx) error {
	fmt.Printf("url: %s method: %s token:%s \n", c.OriginalURL(), c.Method(), c.Cookies("token"))
	return c.Next()
}
func (h *CustomerHandler) register(c *fiber.Ctx) error {
	firstUser := new(User)

	if err := c.BodyParser(firstUser); err != nil {
		return err
	}
	bytes, err := bcrypt.GenerateFromPassword([]byte(firstUser.Password), 10)
	if err != nil {
		c.SendStatus(fiber.StatusBadRequest)
	}
	firstUser.Password = string(bytes)
	result := h.DB.Create(&firstUser)
	if result.Error != nil {
		return c.SendStatus(fiber.ErrBadRequest.Code)
	}
	return c.JSON("success")
}
func (h *CustomerHandler) login(c *fiber.Ctx) error {
	user := new(InputUser)
	if err := c.BodyParser(user); err != nil {
		c.SendStatus(fiber.StatusBadRequest)
	}
	data := User{}
	result := h.DB.First(&data, "email = ?", user.Email)
	if result.Error != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}
	if check := bcrypt.CompareHashAndPassword([]byte(data.Password), []byte(user.Password)); check != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	claims := jwt.MapClaims{
		"email": user.Email,
		"name":  data.Name,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	return c.JSON(t)
}
func (h *CustomerHandler) logout(c *fiber.Ctx) error {
	c.ClearCookie()
	return c.JSON("logout success!!")
}
func main() {
	app := fiber.New()
	h := CustomerHandler{}
	h.Initialize()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://catcat-fronend-react.vercel.app/", // Replace with your frontend origin
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))
	app.Use(checkMiddleware)

	app.Post("/Register", h.register)
	app.Post("/login", h.login)
	app.Get("/logout", h.logout)
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte("secret")},
	}))
	app.Get("/getData", h.getData)
	app.Get("/getData/:catId", h.getDataByID)
	app.Post("/getDataByName", h.getDataByName)
	app.Post("/getDataByCategory", h.getDataByCategory)
	app.Post("/addData", h.addData)
	app.Delete("/deleteData/:catId", h.deleteData)
	app.Post("/updataData", h.updateData)
	app.Listen(":3000")
}
