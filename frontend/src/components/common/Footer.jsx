import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Server, Database, Code, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
                E
              </div>
              <span className="text-lg font-bold text-slate-900">
                Nova<span className="text-brand-600">Mart</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Full-Stack E-Commerce platform integrated with FastAPI backend and high-performance React client.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              API Services Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-600 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-brand-600 transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-600 transition">
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* DevOps Architecture Details */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">DevOps Stack</h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Server className="h-3.5 w-3.5 text-brand-600" />
                <span>Backend: FastAPI + Uvicorn ASGI</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-brand-600" />
                <span>Frontend: React 19 + Vite 6 + Tailwind</span>
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-brand-600" />
                <span>Database: SQLite / PostgreSQL (Neon)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                <span>Deployment: Docker & Render Static/Web</span>
              </li>
            </ul>
          </div>

          {/* Project & Exam Context */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Examination Context</h4>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Developed as a DevOps & Cloud Systems examination project. Built for complete containerization, CI/CD pipeline automation, and production readiness.
            </p>
            <div className="mt-4 text-xs text-slate-400">
              API Docs: <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">/docs</a> &bull; <a href="http://127.0.0.1:8000/redoc" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">/redoc</a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} NovaMart E-Commerce Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern architecture and standard clean design.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
