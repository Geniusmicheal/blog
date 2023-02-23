<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request):JsonResponse {
        $validator =Validator::make($request->all() ,[
            'email'   => 'required|email',
            'password' => 'required|min:6',
        ]);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $user_data=[
            'email' => $request->email,
            'password' => $request->password,
            // $request->get('remember_token')
        ];

        if(!Auth::attempt($user_data,false)) return response()->json(['error'=> 'The Provided credential are not correct'] , 422);
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json(['user' =>$user, 'token' => $token] , 200);

    }

    public function signup(Request $request):JsonResponse{
        $validator =Validator::make($request->all() ,[
            'username'   => 'required|min:2',
            'email' => 'required|email',
            'password'   => 'required|min:6',
            'password_confirmation' => 'min:6|required_with:password|same:password'
        ]);
        if ($validator->fails()) return response()->json($validator->errors(), 422);

        $user = User::where('email', '=',  $request->email)
            ->orWhere('username', '=', $request->username)->first();
        if ($user != null)
            return response()->json(['error'=> 'Email or Username has been used'] , 422);

        $users = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        $token = $users->createToken('main')->plainTextToken;

        return response()->json(['user' =>$users, 'token' => $token] , 201);
    }

    public function updatepreference(Request $request):JsonResponse{
        $email = Auth::user()->email;

        $users  = User::where('email',$email)->update([
            'sources' =>  $request->sources,
            'author' => $request->author ,
            'category' => $request->category,
        ]);
        return response()->json(['user' =>$users] , 201);
    }

    public function  logout(Request $request):JsonResponse{
        $user = Auth::user();
        $user->currentAccessToken()->delete();
        return response()->json(['success'=> true] , 200);
    }
}
