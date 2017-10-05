module ExternalLink exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode exposing (succeed)

import Messages exposing (Msg(OpenExt))


view : String -> String -> Html Msg
view url txt =
  a [ href url, handler (OpenExt url), target "_blank", rel "noopener noreferrer" ] [ text txt ]

options : Options
options = { defaultOptions | preventDefault = True }

handler : Msg -> Attribute Msg
handler msg =
  onWithOptions "click" options (succeed msg)
